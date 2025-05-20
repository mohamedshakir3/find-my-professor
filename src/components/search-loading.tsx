import { Skeleton } from "@/components/ui/skeleton"

export function SearchLoading() {
	return (
		<div className="min-h-screen bg-gray-50">
			<main className="mx-auto max-w-7xl px-4 py-6">
				<div className="mb-6 flex items-center gap-4">
					<div className="relative flex-1">
						<Skeleton className="h-10 w-full rounded-lg" />
					</div>
					<Skeleton className="h-10 w-24 rounded-lg md:hidden" />
				</div>

				<div className="mb-4">
					<Skeleton className="h-5 w-48" />
				</div>

				<div className="flex flex-col md:flex-row gap-6">
					{/* Desktop Sidebar Skeleton */}
					<div className="hidden md:block w-64 shrink-0">
						<div className="bg-white rounded-lg border p-4">
							<div className="flex items-center justify-between mb-6">
								<Skeleton className="h-6 w-20" />
								<Skeleton className="h-8 w-16" />
							</div>
							<div className="space-y-4">
								{[1, 2, 3].map((i) => (
									<div key={i} className="space-y-2">
										<Skeleton className="h-5 w-32" />
										<Skeleton className="h-10 w-full" />
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Results Skeleton */}
					<div className="flex-1">
						<div className="grid gap-6 md:grid-cols-1">
							{[1, 2, 3, 4].map((i) => (
								<div key={i} className="bg-white rounded-lg border p-4">
									<div className="flex items-start gap-3 mb-4">
										<Skeleton className="h-16 w-16 rounded-lg" />
										<div className="flex-1">
											<Skeleton className="h-5 w-3/4 mb-2" />
											<Skeleton className="h-4 w-1/2 mb-1" />
											<Skeleton className="h-4 w-2/3" />
										</div>
									</div>
									<div className="space-y-2">
										<div className="flex flex-wrap gap-2">
											{[1, 2, 3].map((j) => (
												<Skeleton key={j} className="h-6 w-20 rounded-md" />
											))}
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</main>
		</div>
	)
}
