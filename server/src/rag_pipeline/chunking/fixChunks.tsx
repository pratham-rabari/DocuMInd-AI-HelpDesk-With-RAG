import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Document } from "@langchain/core/documents";

export const TextSplitter = async (documents: Document[]): Promise<Document[]> => {
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 550,
        chunkOverlap: 100
    });
    const chunks = await splitter.splitDocuments(documents);

    return chunks.map((chunk) => {
        const pageNumber = chunk.metadata.loc?.pageNumber;

        if (typeof pageNumber === "number") {
            chunk.metadata.pageNumber = pageNumber;
        }

        return chunk;
    });
}