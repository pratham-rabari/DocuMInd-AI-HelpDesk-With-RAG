import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Document } from "@langchain/core/documents";

export const geminiEmbeddings = new GoogleGenerativeAIEmbeddings({
  model: "gemini-embedding-001",
  apiKey: process.env.GEMINI_API_KEY,
});

export const getEmbedding = async (documents: Document[]) => {
  try {
    const texts = documents.map((doc) => doc.pageContent);
    const embadding = await geminiEmbeddings.embedDocuments(texts);
    return embadding;
  } catch (error) {
    throw new Error("Error occurred while generating embeddings:" + error);
  }
};

export const getEmbeddingForQuery = async (query: string) => {
  try{
    const embadding = await geminiEmbeddings.embedQuery(query);
    return embadding;
  } catch (error) {
    throw new Error("Error occurred while generating embedding for query:" + error);
  }
}
