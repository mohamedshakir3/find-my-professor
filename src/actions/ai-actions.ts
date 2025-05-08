import { embed } from "ai"
import { cohere } from "@ai-sdk/cohere"
import { openai } from "@ai-sdk/openai"

export const cohereEmbed = cohere.embedding("embed-english-v3.0")
export const openaiEmbed = openai.embedding("text-embedding-3-small")

export const generateEmbedding = async (value: string): Promise<number[]> => {
  // const input = value.replaceAll("\n", " ")
  const { embedding } = await embed({
    model: cohereEmbed,
    value: value,
  })
  return embedding
}
