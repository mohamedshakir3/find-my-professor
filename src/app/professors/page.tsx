import SearchInterface from "@/components/search-interface"
import { getProfessors, SortBy } from "@/actions/db-actions"
import { Suspense } from "react"
import { SearchLoading } from "@/components/search-loading"
import { PaginationControls } from "@/components/pagination"

export default async function ProfessorsPage({
	searchParams,
}: {
	searchParams: Promise<{
		q?: string
		university?: string | string[]
		faculty?: string | string[]
		department?: string | string[]
		sort?: string
		accepting?: string
		page?: string
	}>
}) {
	let { q, university, faculty, department, sort, accepting, page } = await searchParams

	const currentPage = page ? parseInt(page) : 1
	const universities = typeof university === "string" ? [university] : university
	const faculties = typeof faculty === "string" ? [faculty] : faculty
	const departments = typeof department === "string" ? [department] : department
	const sortBy = (["relevance", "citations_desc", "rank_asc"].includes(sort ?? "")
		? sort
		: "relevance") as SortBy
	const acceptingStudents = accepting === "true" ? true : undefined

	q = q ?? ""
	const {
		professors: profs,
		total,
		pageSize,
	} = await getProfessors(q, currentPage, universities, faculties, departments, sortBy, acceptingStudents)

	const numPages = Math.ceil(total / pageSize)

	return (
		<Suspense fallback={<SearchLoading />}>
			<SearchInterface professors={profs} query={q} sort={sortBy} />
			{numPages > 1 && (
				<PaginationControls
					currentPage={currentPage}
					totalPages={numPages}
					totalItems={total}
				/>
			)}
		</Suspense>
	)
}
