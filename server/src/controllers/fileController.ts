import { response, type Request, type Response } from "express";
import { loadPdf } from "../rag_pipeline/loaders/pdfLoader.js";
import { TextSplitter } from "../rag_pipeline/chunking/fixChunks.js";
import {
  addChunksToChroma,
  vectorStore,
} from "../rag_pipeline/vectorDB/chroma.js";
import { getEmbeddingForQuery } from "../rag_pipeline/embadding/gemini.js";
import { generateAnswer } from "../rag_pipeline/llmApiCall/gemini.js";

interface FileUploadRequest extends Request {
  file?: Express.Multer.File;
}

export const addFilesToChroma = async (
  req: FileUploadRequest,
  res: Response,
) => {
  try {
    if (req.file) {
      const filePath = req.file.path;
      const loadedDocument = await loadPdf(filePath);
      const chunks = await TextSplitter(loadedDocument);
      console.log("startred");
      await addChunksToChroma(chunks);
      console.log("db added");
    }

    if (req.body.query) {
      const query = req.body.query;
      const queryEmbedding = await getEmbeddingForQuery(query);
      console.log("gg");
      const results = await vectorStore.similaritySearchVectorWithScore(
        queryEmbedding,
        3,
      );
      const context = results
        .map(([doc], index) => {
          return `Index_${index + 1}:\nContent: ${doc.pageContent}`;
        })
        .join("\n\n");
      const generatedAnswer = await generateAnswer(query, context);
      console.log(generatedAnswer);
      const uniqueCitationIds = new Set(generatedAnswer.citationIds);

      const citedChunks = results.flatMap(([doc], index) => {
        const chunkId = `Index_${index + 1}`;
        return uniqueCitationIds.has(chunkId)
          ? [{
            chunkId,
            content: doc.pageContent,
            metadata: doc.metadata,
          }]
          : [];
      });

      const response = {
        answer: generatedAnswer.answer,
        citationIds: Array.from(uniqueCitationIds),
        citations: citedChunks,
      };

      return res.status(200).json({ response });
    }
    // return res.status(200).json({response: "File processed and added to Chroma Successfully"});
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error occurred while processing file" });
  }
};
