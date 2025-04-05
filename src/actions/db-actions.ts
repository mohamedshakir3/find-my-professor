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

export type PaginatedResult = {
  professors: Professor[]
  totalCount: number
  currentPage: number
  totalPages: number
  error: string | null
}

export async function findSimilarProfessors(
  query: string,
  page = 1,
  pageSize = 10,
  universities?: string[],
  faculties?: string[],
  departments?: string[]
): Promise<PaginatedResult> {
  const supabase = await createClient()

  try {
    if (!query || query.length < 3) {
      console.log("Query too short, fetching default professors.")

      const { count, error: countError } = await supabase
        .from("professors")
        .select("*", { count: "exact", head: true })

      if (countError) {
        console.error("Error counting professors:", countError)
        return {
          professors: [],
          totalCount: 0,
          currentPage: page,
          totalPages: 0,
          error: countError.message,
        }
      }

      const totalCount = count || 0
      const totalPages = Math.ceil(totalCount / pageSize)

      const { data, error } = await supabase
        .from("professors")
        .select("*")
        .range((page - 1) * pageSize, page * pageSize - 1)
        .order("id", { ascending: true })

      if (error) {
        console.error("Error fetching default professors:", error)
        return {
          professors: [],
          totalCount: 0,
          currentPage: page,
          totalPages: 0,
          error: error.message,
        }
      }

      return {
        professors: data as Professor[],
        totalCount,
        currentPage: page,
        totalPages,
        error: null,
      }
    }

    const embedding = await generateEmbedding(query)

    const { data: matched, error: matchError } = await supabase.rpc(
      "search_professors",
      {
        query_embedding: embedding,
        match_threshold: 0.7,
        match_count: 100,
        search_term: query,
        universities: universities,
        faculties: faculties,
        departments: departments,
      }
    )

    if (matchError) {
      console.error("Error executing search_professors:", matchError)
      return {
        professors: [],
        totalCount: 0,
        currentPage: page,
        totalPages: 0,
        error: matchError.message,
      }
    }

    if (!matched || matched.length === 0) {
      console.log("No matching professors found.")
      return {
        professors: [],
        totalCount: 0,
        currentPage: page,
        totalPages: 0,
        error: null,
      }
    }
    const totalCount = matched.length
    const totalPages = Math.ceil(totalCount / pageSize)

    const profIds = matched
      .slice((page - 1) * pageSize, page * pageSize)
      .map((item: any) => item.prof_id)

    const { data: professors, error: profError } = await supabase
      .from("professors")
      .select("*")
      .in("id", profIds)

    if (profError) {
      console.error("Error fetching professors:", profError)
      return {
        professors: [],
        totalCount,
        currentPage: page,
        totalPages,
        error: profError.message,
      }
    }

    const profsWithSimilarity = professors.map((prof: any) => ({
      ...prof,
      similarity:
        matched.find((m: any) => m.prof_id === prof.id)?.similarity || 0,
    }))

    profsWithSimilarity.sort(
      (a, b) => (b.similarity || 0) - (a.similarity || 0)
    )

    return {
      professors: profsWithSimilarity,
      totalCount,
      currentPage: page,
      totalPages,
      error: null,
    }
  } catch (err) {
    console.error("Error in findSimilarProfessors:", err)
    return {
      professors: [],
      totalCount: 0,
      currentPage: page,
      totalPages: 0,
      error:
        err instanceof Error
          ? err.message
          : "Failed to find similar professors",
    }
  }
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

function removeDuplicates<T>(array: T[], key: keyof T): T[] {
  const seen = new Set()
  return array.filter((item) => {
    const value = item[key]
    if (seen.has(value)) return false
    seen.add(value)
    return true
  })
}

export async function addProfessor(
  professorData: Omit<Professor, "id" | "similarity">
) {
  const supabase = await createClient()

  try {
    const research_interests = Array.isArray(professorData.research_interests)
      ? professorData.research_interests.join(" ")
      : ""

    const past_universities = Array.isArray(professorData.past_education)
      ? professorData.past_education
          .map((edu: any) => edu.university || "")
          .join(" ")
      : ""

    const text_to_embed = `${professorData.name} ${professorData.university} ${
      professorData.faculty
    } ${
      professorData.department || ""
    } ${past_universities} ${research_interests}`

    const embedding = await generateEmbedding(text_to_embed)

    const { data, error } = await supabase
      .from("professors")
      .insert({
        ...professorData,
        embedding,
      })
      .select()
      .single()

    if (error) throw new Error(error.message)

    revalidatePath("/professors")

    return { professor: data as Professor, error: null }
  } catch (err) {
    console.error("Error in addProfessor:", err)
    return {
      professor: null,
      error: err instanceof Error ? err.message : "Failed to add professor",
    }
  }
}

export async function getUniversities(): Promise<string[]> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("universities").select("*")

  if (error) {
    console.error(error)
    return []
  }

  return data
}

export async function getFacultiesByUniversities(
  universities: string[]
): Promise<string[]> {
  let allFaculties: string[] = []

  const facultiesArrays = await Promise.all(
    universities.map((university) => getFacultiesByUniversity(university))
  )

  allFaculties = facultiesArrays.flat()

  return [...new Set(allFaculties)].sort()
}

export async function getFacultiesByUniversity(
  university: string
): Promise<string[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("universities")
    .select("*")
    .eq("name", university)
    .single()

  if (error) {
    console.error(error)
    return []
  }
  return Object.keys(data.university)
}

export async function getDepartmentByFaculties(
  universities: string[],
  faculties: string[]
): Promise<string[]> {
  const allDepartments = await universities.reduce(
    async (uniAccPromise, university) => {
      const uniAcc = await uniAccPromise

      const facultyResults = await faculties.reduce(
        async (facAccPromise, faculty) => {
          const facAcc = await facAccPromise
          const depts = await getDepartmentByFaculty(university, faculty)
          return [...facAcc, ...depts]
        },
        Promise.resolve<string[]>([])
      )

      return [...uniAcc, ...facultyResults]
    },
    Promise.resolve<string[]>([])
  )

  const uniqueDepartments = [...new Set(allDepartments)]

  uniqueDepartments.sort()

  return uniqueDepartments
}

export async function getDepartmentByFaculty(
  university: string,
  faculty: string
): Promise<string[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("universities")
    .select("*")
    .eq("name", university)
    .single()

  if (error || !data) {
    console.error(error || "No data returned")
    return []
  }

  if (!data.university) {
    console.error(`University data not found for ${university}`)
    return []
  }

  if (!data.university[faculty]) {
    console.error(`Faculty ${faculty} not found for ${university}`)
    return []
  }

  if (
    typeof data.university[faculty] === "string" ||
    data.university[faculty] === null ||
    typeof data.university[faculty] !== "object"
  ) {
    return []
  }

  try {
    return Object.keys(data.university[faculty])
  } catch (err) {
    console.error(
      `Error getting departments for ${university}, ${faculty}:`,
      err
    )
    return []
  }
}
