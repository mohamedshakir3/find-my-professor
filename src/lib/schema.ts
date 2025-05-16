import { pgTable, serial, text, vector, index } from "drizzle-orm/pg-core"
import { z } from "zod"
export const professors = pgTable(
  "professors",
  {
    id: serial("id").primaryKey(),
    faculty: text(),
    department: text(),
    email: text(),
    website: text(),
    research_interests: text().array(),
    name: text(),
    university_logo: text(),
    embedding: vector("embedding", { dimensions: 1024 }),
  },
  (table) => ({
    embeddingIndex: index("embeddingIndex").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops")
    ),
  })
)

export const dbProfSchema = z.object({
  id: z.number(),
  faculty: z.string().nullable(),
  department: z.string().nullable(),
  email: z.string().nullable(),
  website: z.string().nullable(),
  research_interests: z.string().array().nullable(),
  name: z.string().nullable(),
  university_logo: z.string().nullable(),
  embedding: z.array(z.number()).nullable(),
  similarity: z.number(),
})

export type DBProf = z.infer<typeof dbProfSchema>
