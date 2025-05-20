"use client"

import Image from "next/image"
import { Mail, ExternalLink, Check, Copy, BookOpen } from "lucide-react"
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
		google_scholar?: string
		cited_by?: number
	}
}

export function ProfessorCard({ professor }: ProfessorCardProps) {
	const [copied, setCopied] = useState<boolean>(false)

	const copyToClipboard = async () => {
		const textToCopy = professor.email
		if (textToCopy) {
			await navigator.clipboard.writeText(textToCopy)
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
		}
		toast(`Copied ${textToCopy} to clipboard`)
	}

	// Ensure research_interests is an array
	const researchInterests = professor.research_interests || []

	// Format citations with commas for thousands
	const formattedCitations = professor.cited_by?.toLocaleString() || "N/A"
	console.log(professor)
	return (
		<div
			key={professor.id}
			className="flex flex-col sm:flex-row overflow-hidden bg-white rounded-lg border hover:shadow-md transition-shadow"
		>
			{/* Left side - dark blue section */}
			<div className="bg-[#31404f] p-4 text-white rounded-t-lg sm:rounded-t-none sm:rounded-l-lg relative sm:w-64 flex flex-col">
				{/* University logo and professor info - left aligned */}
				<div className="flex flex-col items-start">
					<div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-white flex items-center justify-center p-1 mb-3">
						<Image
							src={professor.university_logo || "/placeholder.png"}
							alt={`${professor.name}'s university logo`}
							width={64}
							height={64}
							className="object-cover"
						/>
					</div>

					<div className="text-left">
						<div className="flex items-center gap-2">
							<h2 className="font-semibold">{professor.name}</h2>
							{professor.website && (
								<Link
									href={professor.website}
									target="_blank"
									rel="noopener noreferrer"
								>
									<ExternalLink
										className="h-3.5 w-3.5 text-white/70 hover:text-white transition-colors"
										aria-label="Personal website"
									/>
								</Link>
							)}
						</div>
						<p className="text-sm text-white/80">{professor.faculty}</p>
						<p className="text-xs text-white/70">{professor.department}</p>
					</div>
				</div>

				{/* Metrics section - QS Rank and Citations */}
				<div className="mt-4 flex flex-col gap-2">
					{/* QS Ranking */}
					<HoverCard>
						<HoverCardTrigger asChild>
							{professor.ranking && (
								<div className="bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">
									<div className="text-left flex items-center">
										<div className="font-medium text-white">
											{professor.ranking}
										</div>
										<div className="text-xs text-white/80 ml-2">QS Rank</div>
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

					{/* Citations */}
					<HoverCard>
						<HoverCardTrigger asChild>
							<div className="bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">
								<div className="text-left flex items-center">
									<BookOpen className="h-3.5 w-3.5 mr-2 text-white/70" />
									<div className="font-medium text-white">
										{formattedCitations}
									</div>
									<div className="text-xs text-white/80 ml-2">Citations</div>
								</div>
							</div>
						</HoverCardTrigger>
						<HoverCardContent className="w-80">
							<div className="flex justify-between space-x-4">
								<div className="space-y-1">
									<p className="text-sm">
										Total citations according to Google Scholar
									</p>
								</div>
							</div>
						</HoverCardContent>
					</HoverCard>
				</div>
			</div>

			{/* Right side - content */}
			<div className="flex-1 flex flex-col">
				{/* Research interests - vertically scrollable when overflowing */}
				<div className="flex-grow p-4">
					{researchInterests.length > 0 ? (
						<div className="max-h-[150px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
							<div className="flex flex-wrap gap-2">
								{researchInterests.map((interest: any, index: number) => (
									<Badge
										key={index}
										variant="outline"
										className="rounded-md bg-[#fdecea] text-[#e35535] hover:bg-[#f8d3cf] border-[#e35535]/20 text-xs whitespace-normal break-words max-w-full"
									>
										{interest}
									</Badge>
								))}
							</div>
						</div>
					) : (
						<p className="text-sm text-gray-500 italic">
							No research interests available
						</p>
					)}
				</div>

				{/* Buttons */}
				<div className="flex justify-between bg-gray-50 px-4 py-3 rounded-b-lg sm:rounded-bl-none">
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
					{professor.google_scholar && (
						<Link
							href={professor.google_scholar}
							target="_blank"
							rel="noopener noreferrer"
						>
							<Button
								variant="outline"
								size="sm"
								className="gap-1 text-[#31404f] border-[#31404f]/30 hover:bg-[#e8f0ee] hover:text-[#3a5a52]"
							>
								<BookOpen className="h-4 w-4" />
								Google Scholar
							</Button>
						</Link>
					)}
				</div>
			</div>
		</div>
	)
}

export default ProfessorCard
