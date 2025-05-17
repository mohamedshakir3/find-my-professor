import { Skeleton } from "@/components/ui/skeleton"

export function ProfessorResultsLoading() {
	return (
		<div className="grid gap-6 md:grid-cols-2">
			{[...Array(10).keys()].map((i) => (
				<div
					key={i}
					className="flex flex-col overflow-hidden bg-white rounded-lg border"
				>
					<div className="bg-[#31404f] p-4">
						<div className="flex items-start gap-3">
							<Skeleton className="h-16 w-16 shrink-0 rounded-lg bg-white/20" />
							<div className="flex-1">
								<Skeleton className="h-5 w-3/4 mb-2 bg-white/20" />
								<Skeleton className="h-4 w-1/2 mb-1 bg-white/20" />
								<Skeleton className="h-4 w-2/3 bg-white/20" />
							</div>
						</div>
					</div>
					<div className="flex-grow p-4">
						<div className="flex flex-wrap gap-2">
							{[...Array(4).keys()].map((j) => (
								<Skeleton key={j} className="h-6 w-20 rounded-md" />
							))}
						</div>
					</div>
					<div className="flex justify-between bg-gray-50 px-4 py-3">
						<Skeleton className="h-9 w-28 rounded-md" />
						<Skeleton className="h-9 w-24 rounded-md" />
					</div>
				</div>
			))}
		</div>
	)
}
