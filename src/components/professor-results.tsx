"use client"

import { Suspense } from "react"
import { ProfessorCard } from "./professor-card"
import { ProfessorResultsLoading } from "./professor-results-loading"

export function ProfessorResults({ professors }: { professors: any[] }) {
	return (
		<Suspense fallback={<ProfessorResultsLoading />}>
			<div className="grid gap-6 md:grid-cols-1">
				{professors.map((professor) => (
					<ProfessorCard key={professor.id} professor={professor} />
				))}
			</div>
		</Suspense>
	)
}
