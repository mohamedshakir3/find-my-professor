import { embed } from "ai"
import { cohere } from "@ai-sdk/cohere"

export const cohereEmbed = cohere.embedding("embed-english-light-v3.0")

export const generateEmbedding = async (value: string): Promise<number[]> => {
  // const input = value.replaceAll("\n", " ")
  const { embedding } = await embed({
    model: cohereEmbed,
    value: value,
  })
  return embedding
}
