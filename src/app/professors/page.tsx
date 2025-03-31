import SearchInterface from "@/components/search-interface"
import { searchProfessors } from "@/actions/db-actions"
import { Suspense } from "react"
import { CardGridSkeleton } from "@/components/card-grid-skeleton"
export default async function ProfessorsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const { professors, error } = await searchProfessors(q)
  return (
    <Suspense fallback={<CardGridSkeleton />}>
      <SearchInterface professors={professors} query={q} />
    </Suspense>
  )
}
