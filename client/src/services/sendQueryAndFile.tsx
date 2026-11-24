const API_URL = "http://localhost:5000/api/add-file";

export type Citation = {
  chunkId: string;
  content: string;
  metadata: Record<string, unknown>;
};

type SendQueryResponse = {
  response: {
    answer: string;
    citationIds: string[];
    citations: Citation[];
  };
};

export const sendQuery = async (query: string | undefined,file: File | null,): Promise<SendQueryResponse> => {
  const formData = new FormData();
  const normalizedQuery = query?.trim();

  if (normalizedQuery) {
    formData.append("query", normalizedQuery);
  }

  if (file) {
    formData.append("file", file);
  }

  if (!normalizedQuery && !file) {
    throw new Error("Enter a query or attach a file.");
  }

  const response = await fetch(API_URL, {
    method: "POST",
    body: formData,
  });
  const result = await response.json();
  console.log(result);

  //   typeof result === "object" &&
  //   result !== null &&
  //   "response" in result &&
  //   typeof result.response === "string"
  //     ? result.response
  //     : undefined;

  if (!response.ok) {
    throw new Error(`Request failed (${response.status}).`);
  }

  
  return result;
};