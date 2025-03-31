import { embed } from "ai"
import { cohere } from "@ai-sdk/cohere"

export const embeddingModel = cohere.embedding("embed-english-v3.0")

export const generateEmbedding = async (value: string): Promise<number[]> => {
  const input = value.replaceAll("\n", " ")
  const { embedding } = await embed({
    model: embeddingModel,
    value: input,
  })
  return embedding
}
