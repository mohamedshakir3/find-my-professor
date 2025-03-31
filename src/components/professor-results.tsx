"use client"
import { ProfessorCard } from "./professor-card"

export function ProfessorResults({ professors }: { professors: any[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {professors.map((professor) => (
        <ProfessorCard key={professor.id} professor={professor} />
      ))}
    </div>
  )
}
