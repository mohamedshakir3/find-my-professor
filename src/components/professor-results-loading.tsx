import { Skeleton } from "@/components/ui/skeleton"

export function ProfessorResultsLoading() {
	return (
		<div className="grid gap-4 md:grid-cols-1">
			{[...Array(8).keys()].map((i) => (
				<div
					key={i}
					className="flex flex-col bg-white rounded-lg border border-l-4 border-l-[#31404f]/30 overflow-hidden"
				>
					{/* Header */}
					<div className="flex items-start gap-3 p-4">
						<Skeleton className="shrink-0 h-10 w-10 rounded-md" />
						<div className="flex-1 min-w-0 space-y-2">
							<Skeleton className="h-4 w-40" />
							<Skeleton className="h-3 w-56" />
						</div>
						<div className="flex gap-2">
							<Skeleton className="h-6 w-16 rounded-md" />
							<Skeleton className="h-6 w-16 rounded-md" />
						</div>
					</div>

					{/* Interests */}
					<div className="px-4 pb-3 flex flex-wrap gap-1.5">
						{[...Array(4).keys()].map((j) => (
							<Skeleton key={j} className="h-5 rounded-md" style={{ width: `${60 + j * 20}px` }} />
						))}
					</div>

					{/* Footer */}
					<div className="flex justify-between px-4 py-2.5 bg-gray-50 border-t">
						<Skeleton className="h-8 w-24 rounded-md" />
						<Skeleton className="h-8 w-28 rounded-md" />
					</div>
				</div>
			))}
		</div>
	)
}
