import SearchInterface from "@/components/search-interface"
import { getProfessors } from "@/actions/db-actions"
import { Suspense } from "react"
import { SearchLoading } from "@/components/search-loading"
import { PaginationControls } from "@/components/pagination"

export default async function ProfessorsPage({
	searchParams,
}: {
	searchParams: Promise<{
		q?: string
		universities?: string[]
		faculties?: string[]
		departments?: string[]
		page?: string
	}>
}) {
	let { q, universities, faculties, departments, page } = await searchParams

	const currentPage = page ? Number.parseInt(page as string) : 1

	universities = typeof universities == "string" ? [universities] : universities
	faculties = typeof faculties == "string" ? [faculties] : faculties
	departments = typeof departments == "string" ? [departments] : departments

	q = q ?? ""
	const {
		professors: profs,
		total,
		pageSize,
	} = await getProfessors(q, currentPage, universities, faculties, departments)

	const numPages = Math.ceil(total / pageSize)

	return (
		<Suspense fallback={<SearchLoading />}>
			<SearchInterface professors={profs} query={q} />
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
