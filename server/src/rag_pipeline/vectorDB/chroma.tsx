
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { Document } from "@langchain/core/documents";
import { getEmbedding, geminiEmbeddings } from "../embadding/gemini.js";

export const vectorStore = new Chroma(geminiEmbeddings, {
  collectionName: "rag_test_project3",
  clientParams: {
    host: process.env.CHROMA_HOST ?? "127.0.0.1",
    port: Number(process.env.CHROMA_PORT ?? 8000),
    ssl: process.env.CHROMA_SSL === "true",
  },
});

export const addChunksToChroma = async (chunks: Document[]): Promise<void> => {
  const batchSize = 100;

  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize).map((chunk) => {
      const metadata = { ...chunk.metadata };
      delete metadata.pdf;
      return new Document({ pageContent: chunk.pageContent, metadata });
    });
    const vectors = await getEmbedding(batch);
    await vectorStore.addVectors(vectors, batch);
    console.log(`Stored Chroma batch ${Math.floor(i / batchSize) + 1}`);
  }
};
