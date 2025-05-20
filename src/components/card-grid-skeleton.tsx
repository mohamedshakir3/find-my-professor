import { Skeleton } from "@/components/ui/skeleton"
export function CardGridSkeleton() {
	return (
		<div className="grid grid-cols-1 gap-2">
			{new Array(16).fill("").map((_, i) => (
				<SkeletonCard key={i} />
			))}
		</div>
	)
}

export function SkeletonCard() {
	return (
		<div className="flex flex-col space-y-3">
			<Skeleton className="h-[250px] sm:h-[450px] rounded-xl" />
		</div>
	)
}
