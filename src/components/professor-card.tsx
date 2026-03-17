"use client"

import Image from "next/image"
import { Mail, ExternalLink, Check, Copy, BookOpen } from "lucide-react"
import { ReportButton } from "@/components/report-button"
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
	const [copied, setCopied] = useState(false)

	const copyToClipboard = async () => {
		if (professor.email) {
			await navigator.clipboard.writeText(professor.email)
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
			toast(`Copied ${professor.email} to clipboard`)
		}
	}

	const researchInterests = professor.research_interests || []
	const formattedCitations = professor.cited_by?.toLocaleString() || null

	return (
		<div className="flex flex-col bg-white rounded-lg border border-l-4 border-l-[#31404f] hover:shadow-md transition-shadow overflow-hidden">
			{/* Header */}
			<div className="flex items-start gap-3 p-4">
				<div className="shrink-0 h-10 w-10 rounded-md bg-gray-50 border flex items-center justify-center overflow-hidden">
					<Image
						src={professor.university_logo || "/placeholder.png"}
						alt={`${professor.university} logo`}
						width={40}
						height={40}
						className="object-contain"
					/>
				</div>

				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-1.5 flex-wrap">
						<h2 className="font-semibold text-gray-900 leading-tight">
							{professor.name}
						</h2>
						{professor.website && (
							<Link href={professor.website} target="_blank" rel="noopener noreferrer">
								<ExternalLink className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600 transition-colors" />
							</Link>
						)}
					</div>
					<p className="text-sm text-gray-500 truncate">
						{[professor.faculty, professor.department].filter(Boolean).join(" · ")}
					</p>
				</div>

				{/* Metrics */}
				<div className="shrink-0 flex items-center gap-2">
					{professor.ranking && (
						<HoverCard>
							<HoverCardTrigger asChild>
								<span className="inline-flex items-center gap-1 text-xs font-medium bg-[#31404f]/10 text-[#31404f] px-2 py-1 rounded-md cursor-default select-none">
									{professor.ranking}
									<span className="font-normal opacity-60">QS</span>
								</span>
							</HoverCardTrigger>
							<HoverCardContent className="w-64 text-sm">
								QS World University Rankings by Subject 2025
							</HoverCardContent>
						</HoverCard>
					)}
					{formattedCitations && (
						<HoverCard>
							<HoverCardTrigger asChild>
								<span className="inline-flex items-center gap-1 text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-md cursor-default select-none">
									<BookOpen className="h-3 w-3" />
									{formattedCitations}
								</span>
							</HoverCardTrigger>
							<HoverCardContent className="w-64 text-sm">
								Total citations according to Google Scholar
							</HoverCardContent>
						</HoverCard>
					)}
				</div>
			</div>

			{/* Research interests */}
			{researchInterests.length > 0 && (
				<div className="px-4 pb-3 flex flex-wrap gap-1.5">
					{researchInterests.map((interest, i) => (
						<Badge
							key={i}
							variant="outline"
							className="rounded-md bg-[#fdecea] text-[#e35535] border-[#e35535]/20 text-xs font-normal"
						>
							{interest}
						</Badge>
					))}
				</div>
			)}

			{/* Actions */}
			<div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-t mt-auto">
				{professor.email ? (
					<div className="inline-flex rounded-md">
						<Link href={`mailto:${professor.email}`}>
							<Button
								variant="outline"
								size="sm"
								className="gap-1.5 text-[#31404f] border-[#31404f]/30 hover:bg-[#e8f0ee] rounded-r-none pr-7 border-r-0"
							>
								<Mail className="h-3.5 w-3.5" />
								<span className="hidden sm:inline">Contact</span>
							</Button>
						</Link>
						<button
							onClick={copyToClipboard}
							className="border border-[#31404f]/30 rounded-r-md px-2 inline-flex items-center bg-white text-[#31404f] hover:bg-[#e8f0ee] transition-colors"
							aria-label="Copy email"
						>
							{copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
						</button>
					</div>
				) : (
					<div />
				)}
				<div className="flex items-center gap-1.5">
					{professor.google_scholar && (
						<Link href={professor.google_scholar} target="_blank" rel="noopener noreferrer">
							<Button
								variant="outline"
								size="sm"
								className="gap-1.5 text-[#31404f] border-[#31404f]/30 hover:bg-[#e8f0ee]"
							>
								<BookOpen className="h-3.5 w-3.5" />
								<span className="hidden sm:inline">Google Scholar</span>
							</Button>
						</Link>
					)}
					<ReportButton professorId={professor.id} professorName={professor.name} />
				</div>
			</div>
		</div>
	)
}

export default ProfessorCard
