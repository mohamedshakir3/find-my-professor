import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export interface FilterPanelProps {
  departments: string[]
  faculties: string[]
  universities: string[]
  selectedDepartments: string[]
  setSelectedDepartments: (deps: string[]) => void
  selectedFaculties: string[]
  setSelectedFaculties: (faculties: string[]) => void
  selectedUniversities: string[]
  setSelectedUniversities: (universities: string[]) => void
  universitySearchQuery: string
  setUniversitySearchQuery: (q: string) => void
  facultySearchQuery: string
  setFacultySearchQuery: (q: string) => void
  departmentSearchQuery: string
  setDepartmentSearchQuery: (q: string) => void
}

export function FilterPanel({
  departments,
  universities,
  faculties,
  selectedDepartments,
  setSelectedDepartments,
  selectedFaculties,
  setSelectedFaculties,
  selectedUniversities,
  setSelectedUniversities,
  universitySearchQuery,
  setUniversitySearchQuery,
  facultySearchQuery,
  setFacultySearchQuery,
  departmentSearchQuery,
  setDepartmentSearchQuery,
}: FilterPanelProps) {
  const toggleDepartment = (department: string) => {
    setSelectedDepartments(
      selectedDepartments.includes(department)
        ? selectedDepartments.filter((d) => d !== department)
        : [...selectedDepartments, department]
    )
  }

  const toggleFaculty = (faculty: string) => {
    setSelectedFaculties(
      selectedFaculties.includes(faculty)
        ? selectedFaculties.filter((c) => c !== faculty)
        : [...selectedFaculties, faculty]
    )
  }

  const toggleUniversity = (university: string) => {
    setSelectedUniversities(
      selectedUniversities.includes(university)
        ? selectedUniversities.filter((c) => c !== university)
        : [...selectedUniversities, university]
    )
  }

  return (
    <div className="space-y-6">
      {/* Universities */}
      <div>
        <h3 className="font-medium mb-3">Universities</h3>
        <div className="mb-3">
          <Input
            placeholder="Search universities..."
            value={universitySearchQuery}
            onChange={(e) => setUniversitySearchQuery(e.target.value)}
            className="text-sm"
          />
        </div>
        <div className="max-h-40 overflow-y-auto pr-1 scrollbar-thin">
          <div className="space-y-2">
            {universities.map((uni) => (
              <div key={uni} className="flex items-center space-x-2">
                <Checkbox
                  id={`university-${uni}`}
                  checked={selectedUniversities.includes(uni)}
                  onCheckedChange={() => toggleUniversity(uni)}
                />
                <Label
                  htmlFor={`university-${uni}`}
                  className="text-sm cursor-pointer"
                >
                  {uni}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Separator />
      {/* Faculties */}
      <div>
        <h3 className="font-medium mb-3">Faculties</h3>
        <div className="mb-3">
          <Input
            placeholder="Search faculties..."
            value={facultySearchQuery}
            onChange={(e) => setFacultySearchQuery(e.target.value)}
            className="text-sm"
          />
        </div>
        <div className="max-h-40 overflow-y-auto pr-1 scrollbar-thin">
          <div className="space-y-2">
            {faculties.map((faculty) => (
              <div key={faculty} className="flex items-center space-x-2">
                <Checkbox
                  id={`faculty-${faculty}`}
                  checked={selectedFaculties.includes(faculty)}
                  onCheckedChange={() => toggleFaculty(faculty)}
                />
                <Label
                  htmlFor={`faculty-${faculty}`}
                  className="text-sm cursor-pointer"
                >
                  {faculty}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Separator />

      {/* Departments */}
      <div>
        <h3 className="font-medium mb-3">Departments</h3>
        <div className="mb-3">
          <Input
            placeholder="Search departments..."
            value={departmentSearchQuery}
            onChange={(e) => setDepartmentSearchQuery(e.target.value)}
            className="text-sm"
          />
        </div>
        <div className="max-h-40 overflow-y-auto pr-1 scrollbar-thin">
          <div className="space-y-2">
            {departments.map((department) => (
              <div key={department} className="flex items-center space-x-2">
                <Checkbox
                  id={`department-${department}`}
                  checked={selectedDepartments.includes(department)}
                  onCheckedChange={() => toggleDepartment(department)}
                />
                <Label
                  htmlFor={`department-${department}`}
                  className="text-sm cursor-pointer"
                >
                  {department}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
