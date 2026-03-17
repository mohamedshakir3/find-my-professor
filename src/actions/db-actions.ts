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

export const getProfessors = async (
	query: string,
	page: number = 1,
	universities?: string[],
	faculties?: string[],
	departments?: string[],
	sortBy: SortBy = "relevance"
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
			})

			if (error) throw new Error(error.message)

			const results: (DBProf & { total_count: number })[] = data ?? []
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
			professors: data?.map((p) => ({ ...p, similarity: 0 })) ?? [],
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
