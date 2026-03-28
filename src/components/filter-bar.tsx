"use client"

import { useState } from "react"
import { ChevronDown, X, Check, ArrowUpDown, GraduationCap, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useSharedTransition } from "@/hooks/use-shared-transition"

export type SortOption = "relevance" | "citations_desc" | "rank_asc"

const SORT_LABELS: Record<SortOption, string> = {
  relevance: "Relevance",
  citations_desc: "Citations",
  rank_asc: "QS Rank",
}

interface FilterDropdownProps {
  label: string
  options: string[]
  selected: string[]
  onToggle: (value: string) => void
}

function FilterDropdown({ label, options, selected, onToggle }: FilterDropdownProps) {
  const [search, setSearch] = useState("")
  const filtered = options.filter((o) =>
    o.toLowerCase().includes(search.toLowerCase())
  )
  const count = selected.length

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-9 gap-1.5 border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50",
            count > 0 && "border-[#31404f] bg-[#31404f] text-white hover:bg-[#3a5a52] hover:text-white"
          )}
        >
          {label}
          {count > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/20 text-[10px] font-bold">
              {count}
            </span>
          )}
          <ChevronDown className="h-3.5 w-3.5 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="p-2 border-b">
          <Input
            placeholder={`Search ${label.toLowerCase()}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 text-sm"
          />
        </div>
        <div className="max-h-52 overflow-y-auto p-1">
          {filtered.length === 0 ? (
            <p className="py-3 text-center text-xs text-gray-400">No results</p>
          ) : (
            filtered.map((option) => (
              <div
                key={option}
                className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-gray-50 cursor-pointer"
                onClick={() => onToggle(option)}
              >
                <Checkbox
                  id={`${label}-${option}`}
                  checked={selected.includes(option)}
                  onCheckedChange={() => onToggle(option)}
                  className="pointer-events-none"
                />
                <Label
                  htmlFor={`${label}-${option}`}
                  className="text-sm cursor-pointer flex-1 leading-tight"
                >
                  {option}
                </Label>
                {selected.includes(option) && (
                  <Check className="h-3.5 w-3.5 text-[#31404f]" />
                )}
              </div>
            ))
          )}
        </div>
        {count > 0 && (
          <div className="border-t p-2">
            <button
              onClick={() => selected.forEach(onToggle)}
              className="w-full text-xs text-gray-500 hover:text-gray-700 text-center"
            >
              Clear {label.toLowerCase()}
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

interface SortDropdownProps {
  value: SortOption
  onChange: (v: SortOption) => void
}

function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-1.5 border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <ArrowUpDown className="h-3.5 w-3.5 opacity-60" />
          {SORT_LABELS[value]}
          <ChevronDown className="h-3.5 w-3.5 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-44">
        <div className="p-1">
          {(Object.keys(SORT_LABELS) as SortOption[]).map((opt) => (
            <div
              key={opt}
              onClick={() => onChange(opt)}
              className={cn(
                "flex items-center justify-between rounded-md px-2 py-1.5 text-sm cursor-pointer hover:bg-gray-50",
                value === opt && "font-medium text-[#31404f]"
              )}
            >
              {SORT_LABELS[opt]}
              {value === opt && <Check className="h-3.5 w-3.5" />}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export interface FilterBarProps {
  universities: string[]
  faculties: string[]
  departments: string[]
  selectedUniversities: string[]
  selectedFaculties: string[]
  selectedDepartments: string[]
  onToggleUniversity: (v: string) => void
  onToggleFaculty: (v: string) => void
  onToggleDepartment: (v: string) => void
  acceptingStudents: boolean
  onToggleAccepting: () => void
  sort: SortOption
  onSortChange: (v: SortOption) => void
  onReset: () => void
}

export function FilterBar({
  universities,
  faculties,
  departments,
  selectedUniversities,
  selectedFaculties,
  selectedDepartments,
  onToggleUniversity,
  onToggleFaculty,
  onToggleDepartment,
  acceptingStudents,
  onToggleAccepting,
  sort,
  onSortChange,
  onReset,
}: FilterBarProps) {
  const totalActive =
    selectedUniversities.length + selectedFaculties.length + selectedDepartments.length + (acceptingStudents ? 1 : 0)

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="flex flex-wrap items-center gap-2">
        <FilterDropdown
          label="University"
          options={universities}
          selected={selectedUniversities}
          onToggle={onToggleUniversity}
        />
        <FilterDropdown
          label="Faculty"
          options={faculties}
          selected={selectedFaculties}
          onToggle={onToggleFaculty}
        />
        <FilterDropdown
          label="Department"
          options={departments}
          selected={selectedDepartments}
          onToggle={onToggleDepartment}
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleAccepting}
              className={cn(
                "h-9 gap-1.5 border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50",
                acceptingStudents && "border-[#31404f] bg-[#31404f] text-white hover:bg-[#3a5a52] hover:text-white"
              )}
            >
              <GraduationCap className="h-3.5 w-3.5" />
              Accepting Students
              <Info className={cn("h-3 w-3 text-gray-400", acceptingStudents && "text-white/70")} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-64 text-center">
            Only shows professors who have explicitly indicated they are
            accepting students. Professors without this filter may still be
            accepting students.
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="flex items-center gap-2 sm:ml-auto">
        <SortDropdown value={sort} onChange={onSortChange} />
        {totalActive > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-9 gap-1 text-sm text-gray-500 hover:text-gray-700"
          >
            <X className="h-3.5 w-3.5" />
            Clear filters
          </Button>
        )}
      </div>
    </div>
  )
}
