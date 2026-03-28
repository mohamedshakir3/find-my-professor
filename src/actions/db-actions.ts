"use server"

import { createClient } from "@/utils/supabase/server"
import { generateEmbedding } from "./ai-actions"
import { DBProf } from "@/lib/schema"

export type SortBy = "relevance" | "citations_desc" | "rank_asc"

interface PaginatedResult<T> {
	professors: T[]
	total: number
	page: number
	pageSize: number
}

export interface FilterOptions {
	universities: string[]
	faculties: string[]
	departments: string[]
	// Maps for cascading: university → faculties, faculty → departments
	universityFaculties: Record<string, string[]>
	facultyDepartments: Record<string, string[]>
	universityDepartments: Record<string, string[]>
}

export const getFilterOptions = async (): Promise<FilterOptions> => {
	const supabase = await createClient()
	const { data, error } = await supabase
		.from("professors")
		.select("university, faculty, department")

	if (error) throw new Error(error.message)

	const universities = new Set<string>()
	const faculties = new Set<string>()
	const departments = new Set<string>()
	const universityFaculties: Record<string, Set<string>> = {}
	const facultyDepartments: Record<string, Set<string>> = {}
	const universityDepartments: Record<string, Set<string>> = {}

	for (const row of data ?? []) {
		if (row.university) {
			universities.add(row.university)
			if (row.faculty) {
				;(universityFaculties[row.university] ??= new Set()).add(row.faculty)
			}
			if (row.department) {
				;(universityDepartments[row.university] ??= new Set()).add(row.department)
			}
		}
		if (row.faculty) {
			faculties.add(row.faculty)
			if (row.department) {
				;(facultyDepartments[row.faculty] ??= new Set()).add(row.department)
			}
		}
		if (row.department) departments.add(row.department)
	}

	const toSortedArray = (s: Set<string>) => [...s].sort()
	const mapToArrays = (m: Record<string, Set<string>>) =>
		Object.fromEntries(Object.entries(m).map(([k, v]) => [k, toSortedArray(v)]))

	return {
		universities: toSortedArray(universities),
		faculties: toSortedArray(faculties),
		departments: toSortedArray(departments),
		universityFaculties: mapToArrays(universityFaculties),
		facultyDepartments: mapToArrays(facultyDepartments),
		universityDepartments: mapToArrays(universityDepartments),
	}
}

export const getProfessors = async (
	query: string,
	page: number = 1,
	universities?: string[],
	faculties?: string[],
	departments?: string[],
	sortBy: SortBy = "relevance",
	acceptingStudents?: boolean
): Promise<PaginatedResult<DBProf>> => {
	const pageSize = 20
	const supabase = await createClient()
	try {
		const currentPage = Math.max(1, page)
		const limit = pageSize
		const offset = (currentPage - 1) * limit

		// Search path — query long enough to generate a meaningful embedding
		if (query.length >= 3) {
			const embedding = await generateEmbedding(query)
			const { data, error } = await supabase.rpc("search_professors", {
				query_embedding: embedding,
				match_threshold: 0.38,
				match_count: 250,
				search_term: query,
				universities: universities ?? null,
				faculties: faculties ?? null,
				departments: departments ?? null,
				sort_by: sortBy,
				p_limit: limit,
				p_offset: offset,
				...(acceptingStudents && { p_accepting_students: "Yes" }),
			})

			if (error) throw new Error(error.message)

			const results = (data ?? []).map(({ research_interests_new, ...row }: any) => ({
				...row,
				research_interests: research_interests_new,
			})) as (DBProf & { total_count: number })[]
			return {
				professors: results,
				total: results[0]?.total_count ?? 0,
				page: currentPage,
				pageSize: limit,
			}
		}

		// Browse path — no query, just filter + sort
		let dbQuery = supabase
			.from("professors")
			.select("*", { count: "exact" })

		if (universities?.length) dbQuery = dbQuery.in("university", universities)
		if (faculties?.length) dbQuery = dbQuery.in("faculty", faculties)
		if (departments?.length) dbQuery = dbQuery.in("department", departments)
		if (acceptingStudents) dbQuery = dbQuery.eq("accepting_students", "Yes")

		if (sortBy === "citations_desc") {
			dbQuery = dbQuery.order("cited_by", { ascending: false, nullsFirst: false })
		} else {
			// rank_asc on text is lexicographic which is wrong — keep id order until
			// the browse_professors SQL function is deployed (see CLAUDE.md)
			dbQuery = dbQuery.order("id", { ascending: true })
		}

		const { data, count, error } = await dbQuery.range(offset, offset + limit - 1)

		if (error) throw new Error(error.message)

		return {
			professors: data?.map(({ research_interests_new, embeddings_new, ...p }) => ({
			...p,
			research_interests: research_interests_new,
			similarity: 0,
		})) ?? [],
			total: count || 0,
			page: currentPage,
			pageSize: limit,
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
