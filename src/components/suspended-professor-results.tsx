"use client"

import { searchProfessors } from "@/actions/db-actions"
import { ProfessorResults } from "@/components/professor-results"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export async function SuspendedProfessorResults({
	query,
	page = 1,
	universities,
	faculties,
	departments,
	onResetFilters,
}: {
	query?: string
	page?: number
	universities?: string[]
	faculties?: string[]
	departments?: string[]
	onResetFilters?: () => void
}) {
	const { professors, totalCount, totalPages, error } = await searchProfessors(
		query,
		page,
		20,
		universities,
		faculties,
		departments
	)

	if (professors.length === 0) {
		return (
			<div className="rounded-lg border bg-white p-8 text-center">
				<div className="mx-auto max-w-md">
					<Image
						src="/sad-penguin.png"
						alt="No results illustration"
						width={200}
						height={200}
						className="mx-auto mb-6"
					/>
					<h2 className="text-2xl font-semibold mb-2">No Results Found</h2>
					<p className="text-muted-foreground">
						We couldn't find any professors matching your search criteria.
					</p>
					<p className="mt-2 text-sm text-muted-foreground">
						Try adjusting your filters or search terms.
					</p>
					{onResetFilters && (
						<Button variant="outline" className="mt-4" onClick={onResetFilters}>
							<X className="h-4 w-4 mr-2" />
							Clear Filters
						</Button>
					)}
				</div>
			</div>
		)
	}

	return (
		<>
			<ProfessorResults professors={professors} />
		</>
	)
}
