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

export const addFilesToChroma = async (req: FileUploadRequest,res: Response,) => {
  try {
    if (req.file) {
      const filePath = req.file.path;
      const loadedDocument = await loadPdf(filePath);
      const chunks = await TextSplitter(loadedDocument);
      await addChunksToChroma(chunks);
    }

    
    // return res.status(200).json({response: "File processed and added to Chroma Successfully"});
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error occurred while processing file" });
  }
};
