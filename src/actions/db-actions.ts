"use server"

import { createClient } from "@/utils/supabase/server"
import { generateEmbedding } from "./ai-actions"
import { DBProf } from "@/lib/schema"

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
		if (!prev || item.similarity > prev.similarity) {
			seen.set(item.id, item)
		}
	}

	const unique = Array.from(seen.values())

	unique.sort((a, b) => b.similarity - a.similarity)

	return unique
}

export const getProfessors = async (
	query: string,
	page: number = 1,
	universities?: string[],
	faculties?: string[],
	departments?: string[]
): Promise<PaginatedResult<DBProf>> => {
	const pageSize = 20
	const supabase = await createClient()
	try {
		const currentPage = Math.max(1, page)
		const limit = Math.max(1, pageSize)
		const offset = (currentPage - 1) * limit

		if (
			query.length < 3 &&
			(universities?.length || faculties?.length || departments?.length)
		) {
			const directMatches = await findProfessorsByQuery(
				query,
				universities,
				faculties,
				departments
			)
			const total = directMatches.length
			const paged = directMatches.slice(offset, offset + limit)

			return {
				professors: paged,
				total,
				page: currentPage,
				pageSize: limit,
			}
		} else if (query.length > 3) {
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
		} else {
			const { data, count, error } = await supabase
				.from("professors")
				.select("*", { count: "exact" })
				.range(offset, offset + limit - 1)
				.order("id", { ascending: true })

			if (error) throw new Error(error.message)

			return {
				professors: data?.map((p) => ({ ...p, similarity: 0 })) ?? [],
				total: count || 0,
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
