"use client"

import Image from "next/image"
import {
	Mail,
	ExternalLink,
	Check,
	ChevronUp,
	ChevronDown,
	Copy,
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import Link from "next/link"
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card"

export interface ProfessorCardProps {
	professor: {
		id: number
		name: string
		email: string
		faculty: string
		department: string
		interests: string[]
		website: string
		university?: string
		university_logo: string
		research_interests: string[]
		ranking: string
	}
}

export function ProfessorCard({ professor }: ProfessorCardProps) {
	const [copied, setCopied] = useState<boolean>(false)
	const [showMore, setShowMore] = useState<boolean>(false)

	const copyToClipboard = async () => {
		const textToCopy = professor.email
		if (textToCopy) {
			await navigator.clipboard.writeText(textToCopy)
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
		}
		toast(`Copied ${textToCopy} to clipboard`)
	}

	const initialDisplayCount = 6
	const hasMoreInterests =
		professor.research_interests?.length > initialDisplayCount
	const displayedInterests = showMore
		? professor.research_interests
		: professor.research_interests?.slice(0, initialDisplayCount)

	return (
		<div
			key={professor.id}
			className="flex flex-col overflow-hidden bg-white rounded-lg border hover:shadow-md transition-shadow"
		>
			<div className="bg-[#31404f] p-4 text-white rounded-t-lg relative">
				<div className="flex items-start gap-3">
					<div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-white flex items-center justify-center p-1">
						<Image
							src={professor.university_logo || "/placeholder.png"}
							alt={`${professor.name}'s avatar`}
							width={64}
							height={64}
							className="object-cover"
						/>
					</div>
					<div>
						<h2 className="font-semibold">{professor.name}</h2>
						<p className="text-sm text-white/80">{professor.faculty}</p>
						<p className="text-xs text-white/70">{professor.department}</p>
					</div>
				</div>
				<HoverCard>
					<HoverCardTrigger asChild>
						{professor.ranking && (
							<div className="absolute top-3 right-4 bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">
								<div className="text-center">
									<div className="font-medium text-white">
										{professor.ranking}
									</div>
									<div className="text-xs text-white/80">QS Rank</div>
								</div>
							</div>
						)}
					</HoverCardTrigger>
					<HoverCardContent className="w-80">
						<div className="flex justify-between space-x-4">
							<div className="space-y-1">
								<p className="text-sm">
									QS World University Rankings by Subject 2025
								</p>
							</div>
						</div>
					</HoverCardContent>
				</HoverCard>
			</div>
			<div className="flex-grow p-4">
				<div className="flex flex-wrap gap-2">
					{displayedInterests?.map((interest: any, index: number) => (
						<Badge
							key={index}
							variant="outline"
							className="rounded-md bg-[#fdecea] text-[#e35535] hover:bg-[#f8d3cf] border-[#e35535]/20 text-xs whitespace-normal break-words max-w-full"
						>
							{interest}
						</Badge>
					))}
				</div>
				{hasMoreInterests && (
					<Button
						variant="ghost"
						size="sm"
						onClick={() => setShowMore(!showMore)}
						className="mt-2 text-xs text-gray-500 hover:text-gray-700 p-1 h-auto"
					>
						{showMore ? (
							<span className="flex items-center">
								Show Less
								<ChevronUp className="ml-1 h-3 w-3" />
							</span>
						) : (
							<span className="flex items-center">
								Show More
								<ChevronDown className="ml-1 h-3 w-3" />
							</span>
						)}
					</Button>
				)}
			</div>
			<div className="flex justify-between bg-gray-50 px-4 py-3 rounded-b-lg">
				{professor.email ? (
					<div className="flex">
						<div className="relative inline-flex rounded-md">
							<Link href={`mailto:${professor.email}`}>
								<Button
									variant="outline"
									size="sm"
									className="gap-1 text-[#31404f] border-[#31404f]/30 hover:bg-[#e8f0ee] hover:text-[#3a5a52] rounded-r-none pr-8"
								>
									<Mail size={14} />
									<span className="hidden sm:inline">Contact</span>
								</Button>
							</Link>
							<div className="absolute right-0 inset-y-0 flex items-center">
								<span className="h-4/5 w-px bg-[#31404f]/30"></span>
							</div>
							<button
								onClick={copyToClipboard}
								className="rounded-l-none rounded-r-md border border-[#31404f]/30 border-l-0 px-2 inline-flex items-center justify-center bg-white text-[#31404f] hover:bg-[#e8f0ee] hover:text-[#3a5a52] focus:z-10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#31404f]"
								aria-label="Copy email"
							>
								{copied ? <Check size={14} /> : <Copy size={14} />}
							</button>
						</div>
					</div>
				) : (
					<div></div>
				)}

				<Link
					href={professor.website}
					target="_blank"
					rel="noopener noreferrer"
				>
					<Button
						variant="outline"
						size="sm"
						className="gap-1 text-[#31404f] border-[#31404f]/30 hover:bg-[#e8f0ee] hover:text-[#3a5a52]"
					>
						<ExternalLink className="h-4 w-4" />
						Website
					</Button>
				</Link>
			</div>
		</div>
	)
}
