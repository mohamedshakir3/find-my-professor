"use client"

import { useState } from "react"
import { SearchBox } from "@/components/search-bar"
import { ProfessorResults } from "@/components/professor-results"
import { FilterBar, SortOption } from "@/components/filter-bar"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { universities, faculties, departments } from "@/data/universities"
import Image from "next/image"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useSharedTransition } from "@/hooks/use-shared-transition"
import { DBProf } from "@/lib/schema"

export default function SearchInterface({
  professors,
  query,
  sort,
}: {
  professors: DBProf[]
  query?: string
  sort: SortOption
}) {
  const { startTransition } = useSharedTransition()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [selectedUniversities, setSelectedUniversities] = useState<string[]>(
    () => searchParams.getAll("university")
  )
  const [selectedFaculties, setSelectedFaculties] = useState<string[]>(() =>
    searchParams.getAll("faculty")
  )
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>(() =>
    searchParams.getAll("department")
  )

  const updateParam = (
    type: "university" | "faculty" | "department",
    value: string,
    isAdd: boolean
  ) => {
    const params = new URLSearchParams(searchParams.toString())
    const current = params.getAll(type)
    params.delete(type)
    const next = isAdd ? [...current, value] : current.filter((v) => v !== value)
    next.forEach((v) => params.append(type, v))
    params.delete("page")
    startTransition?.(() => router.push(`${pathname}?${params.toString()}`))
  }

  const toggle = (
    type: "university" | "faculty" | "department",
    value: string,
    selected: string[],
    setSelected: (v: string[]) => void
  ) => {
    const isAdd = !selected.includes(value)
    setSelected(isAdd ? [...selected, value] : selected.filter((v) => v !== value))
    updateParam(type, value, isAdd)
  }

  const handleSortChange = (value: SortOption) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === "relevance") {
      params.delete("sort")
    } else {
      params.set("sort", value)
    }
    params.delete("page")
    startTransition?.(() => router.push(`${pathname}?${params.toString()}`))
  }

  const resetFilters = () => {
    setSelectedUniversities([])
    setSelectedFaculties([])
    setSelectedDepartments([])
    const params = new URLSearchParams(searchParams.toString())
    params.delete("university")
    params.delete("faculty")
    params.delete("department")
    params.delete("page")
    startTransition?.(() => router.push(`${pathname}?${params.toString()}`))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-5xl px-4 py-6 space-y-4">
        <SearchBox query={query} />

        <FilterBar
          universities={universities}
          faculties={faculties}
          departments={departments}
          selectedUniversities={selectedUniversities}
          selectedFaculties={selectedFaculties}
          selectedDepartments={selectedDepartments}
          onToggleUniversity={(v) =>
            toggle("university", v, selectedUniversities, setSelectedUniversities)
          }
          onToggleFaculty={(v) =>
            toggle("faculty", v, selectedFaculties, setSelectedFaculties)
          }
          onToggleDepartment={(v) =>
            toggle("department", v, selectedDepartments, setSelectedDepartments)
          }
          sort={sort}
          onSortChange={handleSortChange}
          onReset={resetFilters}
        />

        <p className="text-sm text-muted-foreground">
          {professors.length} professor{professors.length !== 1 ? "s" : ""}
          {query && <span> for &ldquo;{query}&rdquo;</span>}
        </p>

        {professors.length > 0 ? (
          <ProfessorResults professors={professors} />
        ) : (
          <div className="rounded-lg border bg-white p-8 text-center">
            <div className="mx-auto max-w-sm">
              <Image
                src="/sad-penguin.png"
                alt="No results"
                width={160}
                height={160}
                className="mx-auto mb-6"
              />
              <h2 className="text-xl font-semibold mb-2">No Results Found</h2>
              <p className="text-sm text-muted-foreground">
                Try adjusting your filters or search terms.
              </p>
              <Button variant="outline" size="sm" className="mt-4" onClick={resetFilters}>
                <X className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
