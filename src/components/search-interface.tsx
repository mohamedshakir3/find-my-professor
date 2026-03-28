"use client"

import { useMemo, useState } from "react"
import { SearchBox } from "@/components/search-bar"
import { ProfessorResults } from "@/components/professor-results"
import { FilterBar, SortOption } from "@/components/filter-bar"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import type { FilterOptions } from "@/actions/db-actions"
import Image from "next/image"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useSharedTransition } from "@/hooks/use-shared-transition"
import { DBProf } from "@/lib/schema"

export default function SearchInterface({
  professors,
  query,
  sort,
  filterOptions,
}: {
  professors: DBProf[]
  query?: string
  sort: SortOption
  filterOptions: FilterOptions
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
  const [acceptingStudents, setAcceptingStudents] = useState(
    () => searchParams.get("accepting") === "true"
  )

  // Cascading filter options based on current selections
  const filteredFaculties = useMemo(() => {
    if (selectedUniversities.length === 0) return filterOptions.faculties
    const sets = selectedUniversities.map(
      (u) => filterOptions.universityFaculties[u] ?? []
    )
    return [...new Set(sets.flat())].sort()
  }, [selectedUniversities, filterOptions])

  const filteredDepartments = useMemo(() => {
    let depts: string[]

    if (selectedFaculties.length > 0) {
      // Faculty selected → show departments for those faculties
      const sets = selectedFaculties.map(
        (f) => filterOptions.facultyDepartments[f] ?? []
      )
      depts = [...new Set(sets.flat())]
    } else if (selectedUniversities.length > 0) {
      // Only university selected → show departments for those universities
      const sets = selectedUniversities.map(
        (u) => filterOptions.universityDepartments[u] ?? []
      )
      depts = [...new Set(sets.flat())]
    } else {
      return filterOptions.departments
    }

    return depts.sort()
  }, [selectedUniversities, selectedFaculties, filterOptions])

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

  const toggleUniversity = (value: string) => {
    const isAdd = !selectedUniversities.includes(value)
    const nextUnis = isAdd
      ? [...selectedUniversities, value]
      : selectedUniversities.filter((v) => v !== value)
    setSelectedUniversities(nextUnis)

    // Compute which faculties/departments are still valid
    const validFaculties =
      nextUnis.length > 0
        ? new Set(nextUnis.flatMap((u) => filterOptions.universityFaculties[u] ?? []))
        : null
    const validDepts =
      nextUnis.length > 0
        ? new Set(nextUnis.flatMap((u) => filterOptions.universityDepartments[u] ?? []))
        : null

    const nextFaculties = validFaculties
      ? selectedFaculties.filter((f) => validFaculties.has(f))
      : selectedFaculties
    const nextDepts = validDepts
      ? selectedDepartments.filter((d) => validDepts.has(d))
      : selectedDepartments

    setSelectedFaculties(nextFaculties)
    setSelectedDepartments(nextDepts)

    // Build params with cleaned-up child filters
    const params = new URLSearchParams(searchParams.toString())
    params.delete("university")
    params.delete("faculty")
    params.delete("department")
    params.delete("page")
    nextUnis.forEach((v) => params.append("university", v))
    nextFaculties.forEach((v) => params.append("faculty", v))
    nextDepts.forEach((v) => params.append("department", v))
    startTransition?.(() => router.push(`${pathname}?${params.toString()}`))
  }

  const toggleFaculty = (value: string) => {
    const isAdd = !selectedFaculties.includes(value)
    const nextFaculties = isAdd
      ? [...selectedFaculties, value]
      : selectedFaculties.filter((v) => v !== value)
    setSelectedFaculties(nextFaculties)

    // Compute which departments are still valid
    const validDepts =
      nextFaculties.length > 0
        ? new Set(nextFaculties.flatMap((f) => filterOptions.facultyDepartments[f] ?? []))
        : null
    const nextDepts = validDepts
      ? selectedDepartments.filter((d) => validDepts.has(d))
      : selectedDepartments
    setSelectedDepartments(nextDepts)

    const params = new URLSearchParams(searchParams.toString())
    params.delete("faculty")
    params.delete("department")
    params.delete("page")
    nextFaculties.forEach((v) => params.append("faculty", v))
    nextDepts.forEach((v) => params.append("department", v))
    startTransition?.(() => router.push(`${pathname}?${params.toString()}`))
  }

  const toggleDepartment = (value: string) => {
    const isAdd = !selectedDepartments.includes(value)
    const next = isAdd
      ? [...selectedDepartments, value]
      : selectedDepartments.filter((v) => v !== value)
    setSelectedDepartments(next)
    updateParam("department", value, isAdd)
  }

  const handleToggleAccepting = () => {
    const next = !acceptingStudents
    setAcceptingStudents(next)
    const params = new URLSearchParams(searchParams.toString())
    if (next) {
      params.set("accepting", "true")
    } else {
      params.delete("accepting")
    }
    params.delete("page")
    startTransition?.(() => router.push(`${pathname}?${params.toString()}`))
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
    setAcceptingStudents(false)
    const params = new URLSearchParams(searchParams.toString())
    params.delete("university")
    params.delete("faculty")
    params.delete("department")
    params.delete("accepting")
    params.delete("page")
    startTransition?.(() => router.push(`${pathname}?${params.toString()}`))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-5xl px-4 py-6 space-y-4">
        <SearchBox query={query} />

        <FilterBar
          universities={filterOptions.universities}
          faculties={filteredFaculties}
          departments={filteredDepartments}
          selectedUniversities={selectedUniversities}
          selectedFaculties={selectedFaculties}
          selectedDepartments={selectedDepartments}
          onToggleUniversity={toggleUniversity}
          onToggleFaculty={toggleFaculty}
          onToggleDepartment={toggleDepartment}
          acceptingStudents={acceptingStudents}
          onToggleAccepting={handleToggleAccepting}
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
