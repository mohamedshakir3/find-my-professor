"use server"

import { createClient } from "@/utils/supabase/server"
import { generateEmbedding } from "./ai-actions"
import {
  cosineDistance,
  desc,
  getTableColumns,
  gt,
  or,
  sql,
} from "drizzle-orm"
import { professors, DBProf } from "@/lib/schema"
import { db } from "@/lib/db"

const { embedding: _, ...rest } = getTableColumns(professors)
const profsWithoutEmbedding = {
  ...rest,
  embedding: sql<number[]>`ARRAY[]::integer[]`,
}

export type Professor = {
  id: number
  name: string
  university: string
  faculty: number
  department?: string
  research_interests: string[]
  past_education: any
  similarity?: number
}

export type PageResult = {
  professors: Professor[]
  totalCount: number
  currentPage: number
  totalPages: number
  error: string | null
}

interface PaginatedResult<T> {
  professors: T[]
  total: number
  page: number
  pageSize: number
}

export async function searchProfessors(
  query?: string,
  page = 1,
  pageSize = 10,
  universities?: string[],
  faculties?: string[],
  departments?: string[]
): Promise<PageResult> {
  const supabase = await createClient()

  try {
    if (!query || query.length < 3) {
      console.log("Fetching default professors due to short query")

      const { count, error: countError } = await supabase
        .from("professors")
        .select("*", { count: "exact", head: true })

      if (countError) throw new Error(countError.message)

      const totalCount = count || 0
      const totalPages = Math.ceil(totalCount / pageSize)

      const { data, error } = await supabase
        .from("professors")
        .select("*")
        .range((page - 1) * pageSize, page * pageSize - 1)
        .order("id", { ascending: true })

      if (error) throw new Error(error.message)

      return {
        professors: data as Professor[],
        totalCount,
        currentPage: page,
        totalPages,
        error: null,
      }
    }

    const embedding = await generateEmbedding(query)

    const { data, error } = await supabase.rpc(
      "search_professors_with_details",
      {
        query_embedding: embedding,
        search_term: query,
        match_threshold: 0.5,
        page_size: pageSize,
        page_number: page,
        universities: universities,
        faculties: faculties,
        departments: departments,
      }
    )

    if (error) {
      console.error("Error executing search_professors_with_details:", error)
      return {
        professors: [],
        totalCount: 0,
        currentPage: page,
        totalPages: 0,
        error: error.message,
      }
    }

    if (!data || data.length === 0) {
      console.log("No matching professors found.")
      return {
        professors: [],
        totalCount: 0,
        currentPage: page,
        totalPages: 0,
        error: null,
      }
    }

    const totalCount = data[0].total_count
    const totalPages = Math.ceil(totalCount / pageSize)

    const professors = data.map((prof: any) => ({
      id: prof.id,
      name: prof.name,
      university: prof.university,
      faculty: prof.faculty,
      department: prof.department,
      email: prof.email,
      website: prof.website,
      university_logo: prof.university_logo,
      research_interests: prof.research_interests,
      similarity: prof.similarity,
    }))

    return {
      professors,
      totalCount,
      currentPage: page,
      totalPages,
      error: null,
    }
  } catch (err) {
    console.error("Error in searchProfessors:", err)
    return {
      professors: [],
      totalCount: 0,
      currentPage: page,
      totalPages: 0,
      error: err instanceof Error ? err.message : "Error, please try again.",
    }
  }
}

export async function enhancedSearchProfessors(
  query?: string,
  page = 1,
  pageSize = 10,
  universities?: string[],
  faculties?: string[],
  departments?: string[]
): Promise<PageResult> {
  const supabase = await createClient()

  try {
    if (!query || query.length < 3) {
      console.log("Fetching default professors due to short query")

      const { count, error: countError } = await supabase
        .from("professors")
        .select("*", { count: "exact", head: true })

      if (countError) throw new Error(countError.message)

      const totalCount = count || 0
      const totalPages = Math.ceil(totalCount / pageSize)

      const { data, error } = await supabase
        .from("professors")
        .select("*")
        .range((page - 1) * pageSize, page * pageSize - 1)
        .order("id", { ascending: true })

      if (error) throw new Error(error.message)

      return {
        professors: data as Professor[],
        totalCount,
        currentPage: page,
        totalPages,
        error: null,
      }
    }
    const embedding = await generateEmbedding(query)

    const { data, error } = await supabase.rpc("enhanced_search_profs", {
      query_embedding: embedding,
      search_term: query,
      match_threshold: 0.5,
      page_size: pageSize,
      page_number: page,
      universities:
        universities && universities.length > 0 ? universities : null,
      faculties: faculties && faculties.length > 0 ? faculties : null,
      departments: departments && departments.length > 0 ? departments : null,
    })
    if (error) {
      console.error("Error executing enhanced_search_profs:", error)
      throw new Error(error.message)
    }
    if (!data || data.length === 0) {
      console.log("No matching professors found.")
      return {
        professors: [],
        totalCount: 0,
        currentPage: page,
        totalPages: 0,
        error: null,
      }
    }

    const totalCount = Number((data[0] as any).total_count)
    const totalPages = Math.ceil(totalCount / pageSize)

    const professors = (data as any[]).map((row) => ({
      id: row.id,
      name: row.name,
      university: row.university,
      faculty: row.faculty,
      department: row.department,
      website: row.website,
      research_interests: row.research_interests,
      similarity: row.similarity,
      university_logo: row.university_logo,
      email: row.email,
    })) as any[]
    return {
      professors,
      totalCount,
      currentPage: page,
      totalPages,
      error: null,
    }
  } catch (err: any) {
    console.error("Error in searchProfessors:", err)
    return {
      professors: [],
      totalCount: 0,
      currentPage: page,
      totalPages: 0,
      error: err.message ?? "Unknown error",
    }
  }
}

export const findSimilarProfs = async (
  query: string,
  universities?: string[],
  faculties?: string[],
  departments?: string[]
) => {
  const embedding = await generateEmbedding(query)
  const supabase = await createClient()
  const { data, error } = await supabase.rpc("search_prof_embeddings", {
    query_embedding: embedding,
    match_threshold: 0.38,
    max_results: 250,
    universities: universities ?? null,
    faculties: faculties ?? null,
    departments: departments ?? null,
  })
  return data ?? []
}

export const findProfessorsByQuery = async (
  query: string,
  universities?: string[],
  faculties?: string[],
  departments?: string[]
) => {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc("search_profs_exact", {
    search_term: query,
    max_results: 250,
    universities: universities ?? null,
    faculties: faculties ?? null,
    departments: departments ?? null,
  })
  return data ?? []
}

function uniqueItemsByObject(items: DBProf[]): DBProf[] {
  const seen = new Map<number, DBProf>()

  for (const item of items) {
    const prev = seen.get(item.id)
    if (!prev || item.similarity < prev.similarity) {
      seen.set(item.id, item)
    }
  }

  const unique = Array.from(seen.values())

  unique.sort((a, b) => b.similarity - a.similarity)

  return unique
}

export const getProfessors = async (
  query?: string,
  page: number = 1,
  universities?: string[],
  faculties?: string[],
  departments?: string[]
): Promise<PaginatedResult<DBProf>> => {
  const pageSize = 20
  try {
    const currentPage = Math.max(1, page)
    const limit = Math.max(1, pageSize)
    const offset = (currentPage - 1) * limit

    if (!query || query.length < 3) {
      const [allProfs, [{ count }]] = await Promise.all([
        db
          .select(profsWithoutEmbedding)
          .from(professors)
          .limit(limit)
          .offset(offset),
        db.select({ count: sql<number>`COUNT(*)` }).from(professors),
      ])

      return {
        professors: allProfs.map((p) => ({ ...p, similarity: 0 })),
        total: count,
        page: currentPage,
        pageSize: limit,
      }
    } else {
      const directMatches = await findProfessorsByQuery(
        query,
        universities,
        faculties,
        departments
      )
      const semanticMatches = await findSimilarProfs(
        query,
        universities,
        faculties,
        departments
      )

      const allMatches = uniqueItemsByObject([
        ...directMatches,
        ...semanticMatches,
      ])

      const total = allMatches.length
      const paged = allMatches.slice(offset, offset + limit)

      return {
        professors: paged,
        total,
        page: currentPage,
        pageSize: limit,
      }
    }
  } catch (e) {
    console.error(e)
    return {
      professors: [],
      total: 0,
      page,
      pageSize,
    }
  }
}
