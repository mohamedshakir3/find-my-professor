import { Skeleton } from "@/components/ui/skeleton"

export function ProfessorResultsLoading() {
	return (
		<div className="grid gap-6 md:grid-cols-1">
			{[...Array(10).keys()].map((i) => (
				<div
					key={i}
					className="flex flex-col sm:flex-row overflow-hidden bg-white rounded-lg border hover:shadow-md transition-shadow"
				>
					{/* Left side - dark blue section */}
					<div className="bg-[#31404f] p-4 text-white rounded-t-lg sm:rounded-t-none sm:rounded-l-lg relative sm:w-64 flex flex-col">
						{/* University logo and professor info */}
						<div className="flex flex-col items-start">
							<Skeleton className="h-16 w-16 shrink-0 rounded-lg bg-white/20 mb-3" />
							<div className="text-left w-full">
								<Skeleton className="h-5 w-3/4 mb-2 bg-white/20" />
								<Skeleton className="h-4 w-1/2 mb-1 bg-white/20" />
								<Skeleton className="h-4 w-2/3 bg-white/20" />
							</div>
						</div>

						{/* Metrics section - QS Rank and Citations */}
						<div className="mt-4 flex flex-col gap-2">
							{/* QS Ranking skeleton */}
							<div className="bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">
								<div className="text-left flex items-center">
									<Skeleton className="h-5 w-16 bg-white/20" />
									<Skeleton className="h-3 w-12 ml-2 bg-white/20" />
								</div>
							</div>

							{/* Citations skeleton */}
							<div className="bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">
								<div className="text-left flex items-center">
									<Skeleton className="h-3.5 w-3.5 mr-2 rounded-full bg-white/20" />
									<Skeleton className="h-5 w-16 bg-white/20" />
									<Skeleton className="h-3 w-12 ml-2 bg-white/20" />
								</div>
							</div>
						</div>
					</div>

					{/* Right side - content */}
					<div className="flex-1 flex flex-col">
						{/* Research interests */}
						<div className="flex-grow p-4">
							<div className="max-h-[150px] overflow-y-auto pr-1">
								<div className="flex flex-wrap gap-2">
									{[...Array(6).keys()].map((j) => (
										<Skeleton key={j} className="h-6 w-20 rounded-md" />
									))}
								</div>
							</div>
						</div>

						{/* Buttons */}
						<div className="flex justify-between bg-gray-50 px-4 py-3 rounded-b-lg sm:rounded-bl-none">
							<div className="flex">
								<Skeleton className="h-9 w-28 rounded-md" />
							</div>
							<Skeleton className="h-9 w-32 rounded-md" />
						</div>
					</div>
				</div>
			))}
		</div>
	)
}
