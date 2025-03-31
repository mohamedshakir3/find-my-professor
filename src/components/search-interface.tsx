"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { universities, faculties, departments } from "@/data/universities"
import { SearchBox } from "@/components/search-bar"
import { ProfessorResults } from "@/components/professor-results"
import { FilterPanel } from "@/components/filter-panel"

export default function SearchInterface({
  professors,
  query,
}: {
  professors: any[]
  query?: string
}) {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([])
  const [selectedFaculties, setSelectedFaculties] = useState<string[]>([])
  const [selectedColleges, setSelectedColleges] = useState<string[]>([])
  const [selectedUniversities, setSelectedUniversities] = useState<string[]>(
    []
  )
  const [universitySearchQuery, setUniversitySearchQuery] = useState("")
  const [facultySearchQuery, setFacultySearchQuery] = useState("")
  const [departmentSearchQuery, setDepartmentSearchQuery] = useState("")

  const [filteredProfessors, setFilteredProfessors] = useState(professors)
  useEffect(() => {
    let filtered = professors

    if (selectedDepartments.length > 0) {
      filtered = filtered.filter((professor) =>
        selectedDepartments.includes(professor.department)
      )
    }

    if (selectedFaculties.length > 0) {
      filtered = filtered.filter((professor) =>
        selectedFaculties.includes(professor.faculty)
      )
    }

    if (selectedUniversities.length > 0) {
      filtered = filtered.filter((professor) =>
        selectedUniversities.includes(professor.university)
      )
    }

    setFilteredProfessors(filtered)
  }, [
    professors,
    selectedDepartments,
    selectedFaculties,
    selectedColleges,
    selectedUniversities,
  ])

  useEffect(() => {
    setFilteredProfessors(professors)
  }, [professors])

  const filteredUniversities = universities.filter((university) =>
    university.toLowerCase().includes(universitySearchQuery.toLowerCase())
  )

  const filteredFaculties = faculties.filter((faculty) =>
    faculty.toLowerCase().includes(facultySearchQuery.toLowerCase())
  )

  const filteredDepartments = departments.filter((department) =>
    department.toLowerCase().includes(departmentSearchQuery.toLowerCase())
  )

  const resetFilters = () => {
    setSelectedDepartments([])
    setSelectedFaculties([])
    setSelectedColleges([])
    setSelectedUniversities([])
    setUniversitySearchQuery("")
    setFacultySearchQuery("")
    setDepartmentSearchQuery("")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-6 flex items-center gap-4">
          <div className="relative flex-1">
            <SearchBox query={query} />
          </div>

          <Sheet
            open={isMobileFilterOpen}
            onOpenChange={setIsMobileFilterOpen}
          >
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="md:hidden"
                onClick={() => setIsMobileFilterOpen(true)}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] sm:w-[400px] overflow-y-auto"
            >
              <div className="py-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <Button variant="outline" size="sm" onClick={resetFilters}>
                    Reset
                  </Button>
                </div>
                <FilterPanel
                  departments={filteredDepartments}
                  universities={filteredUniversities}
                  faculties={filteredFaculties}
                  selectedDepartments={selectedDepartments}
                  setSelectedDepartments={setSelectedDepartments}
                  selectedFaculties={selectedFaculties}
                  setSelectedFaculties={setSelectedFaculties}
                  selectedUniversities={selectedUniversities}
                  setSelectedUniversities={setSelectedUniversities}
                  universitySearchQuery={universitySearchQuery}
                  setUniversitySearchQuery={setUniversitySearchQuery}
                  facultySearchQuery={facultySearchQuery}
                  setFacultySearchQuery={setFacultySearchQuery}
                  departmentSearchQuery={departmentSearchQuery}
                  setDepartmentSearchQuery={setDepartmentSearchQuery}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Search results count */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {filteredProfessors.length} professors
            {query && <span> for "{query}"</span>}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Desktop Sidebar */}
          <div className="hidden md:block w-64 shrink-0">
            <div className="bg-white rounded-lg border p-4 sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Filters</h2>
                <Button variant="outline" size="sm" onClick={resetFilters}>
                  Reset
                </Button>
              </div>

              <FilterPanel
                departments={filteredDepartments}
                universities={filteredUniversities}
                faculties={filteredFaculties}
                selectedDepartments={selectedDepartments}
                setSelectedDepartments={setSelectedDepartments}
                selectedFaculties={selectedFaculties}
                setSelectedFaculties={setSelectedFaculties}
                selectedUniversities={selectedUniversities}
                setSelectedUniversities={setSelectedUniversities}
                universitySearchQuery={universitySearchQuery}
                setUniversitySearchQuery={setUniversitySearchQuery}
                facultySearchQuery={facultySearchQuery}
                setFacultySearchQuery={setFacultySearchQuery}
                departmentSearchQuery={departmentSearchQuery}
                setDepartmentSearchQuery={setDepartmentSearchQuery}
              />
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            {filteredProfessors.length > 0 ? (
              <ProfessorResults professors={filteredProfessors} />
            ) : (
              <div className="rounded-lg border bg-white p-8 text-center">
                <div className="mx-auto max-w-md">
                  <h2 className="text-2xl font-semibold mb-2">
                    No Results Found
                  </h2>
                  <p className="text-muted-foreground">
                    We couldn't find any professors matching your search
                    criteria.
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Try adjusting your filters or search terms.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={resetFilters}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
