
import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY?.trim();

const ai = apiKey
    ? new GoogleGenAI({ apiKey })
    : null;

type GeneratedAnswer = {
    answer: string;
    citationIds: string[];
};

function isGeneratedAnswer(value: unknown): value is GeneratedAnswer {
    return (
        typeof value === "object" &&
        value !== null &&
        "answer" in value &&
        typeof value.answer === "string" &&
        "citationIds" in value &&
        Array.isArray(value.citationIds) &&
        value.citationIds.every((id: unknown) => typeof id === "string")
    );
}

export const generateAnswer = async (
    query: string,
    context: string,
): Promise<GeneratedAnswer> => {
    if (!apiKey || !ai) {
        throw new Error("GEMINI_API_KEY is not configured.");
    }

    const normalizedQuery = query?.trim();
    const normalizedContext = context?.trim();

    if (!normalizedQuery) {
        throw new Error("A query is required.");
    }

    if (!normalizedContext) {
        throw new Error("Context is required.");
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: `
You are a customer support assistant. Answer using only the provided context.

Return a JSON object with:
- "answer": your answer, or "I don't know based on the provided context." if unsupported.do not append citation id in answer.
- "citationIds": the IDs of context chunks that support the answer.

-.

// Citation instructions for "answer":
// - Add the supporting chunk ID inline at the end of each sentence or line it supports, formatted as [chunk-id].
// - When different sentences or lines use different chunks, cite each one separately at the end of the relevant sentence or line.
// - If a statement combines information from multiple chunks and cannot be split clearly, put all supporting chunk IDs together at its end, for example [chunk-id-1] [chunk-id-2].
// - Include in "citationIds" every exact chunk ID cited in the answer, and no unsupported IDs. Do not return an "add-citation-id" field.

// Use only the exact chunk IDs provided. Do not invent IDs. Return an empty citationIds array if the context does not support an answer.

Context:
${normalizedContext}

User question:
${normalizedQuery}`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        answer: {
                            type: Type.STRING,
                        },
                        citationIds: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.STRING,
                            },
                        },
                    },
                    required: ["answer", "citationIds"],
                },
            },
        });

        if (!response.text?.trim()) {
            throw new Error("Gemini returned an empty response.");
        }

        const result: unknown = JSON.parse(response.text);
        if (!isGeneratedAnswer(result)) {
            throw new Error("Gemini returned an invalid answer structure.");
        }

        return result;
    } catch (error) {
        if (error instanceof Error) {
            console.error("Failed to generate Gemini answer:", error.message);
            throw new Error(`Failed to generate Gemini answer: ${error.message}`, {
                cause: error
            });
        }

        console.error("Failed to generate Gemini answer:", error);
        throw new Error("Failed to generate Gemini answer.");
    }
};
