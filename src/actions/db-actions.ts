"use server"

import { createClient } from "@/utils/supabase/server"
import { generateEmbedding } from "./ai-actions"
import { revalidatePath } from "next/cache"
import { University } from "lucide-react"

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

export type NewProfessor = {
  id: number
  name: string
  email: string
  university: string
  faculty: string
  department: string
  website: string
  research_interests: string[]
  similarity: number
  total_count: number
}

export type PaginatedResult = {
  professors: Professor[]
  totalCount: number
  currentPage: number
  totalPages: number
  error: string | null
}

export async function searchProfessors(
  query?: string,
  page = 1,
  pageSize = 10,
  universities?: string[],
  faculties?: string[],
  departments?: string[]
): Promise<PaginatedResult> {
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
): Promise<PaginatedResult> {
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
