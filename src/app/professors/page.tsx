import SearchInterface from "@/components/search-interface"
import {
  enhancedSearchProfessors,
  getProfessors,
  searchProfessors,
} from "@/actions/db-actions"
import { Suspense } from "react"
import { CardGridSkeleton } from "@/components/card-grid-skeleton"
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

  universities =
    typeof universities == "string" ? [universities] : universities
  faculties = typeof faculties == "string" ? [faculties] : faculties
  departments = typeof departments == "string" ? [departments] : departments

  // const { professors, totalCount, totalPages, error } = await searchProfessors(
  //   q,
  //   currentPage,
  //   20,
  //   universities,
  //   faculties,
  //   departments
  // )
  const {
    professors: profs,
    total,
    page: pageNum,
    pageSize,
  } = await getProfessors(q, currentPage, universities, faculties, departments)

  console.log(total, pageNum, pageSize)
  const numPages = Math.ceil(total / pageSize)
  return (
    <>
      <Suspense fallback={<CardGridSkeleton />}>
        <SearchInterface professors={profs} query={q} />

        {numPages > 1 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={numPages}
            totalItems={total}
          />
        )}
      </Suspense>
    </>
  )
}
