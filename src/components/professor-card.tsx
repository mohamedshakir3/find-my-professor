"use client"

import Image from "next/image"
import {
  Mail,
  ExternalLink,
  Check,
  Copy,
  BookOpen,
  GraduationCap,
} from "lucide-react"
import { ReportButton } from "@/components/report-button"
import { useState } from "react"
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
    accepting_students?: string | null
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
    <div className="relative flex flex-col bg-white rounded-lg border border-l-4 border-l-[#31404f] hover:shadow-md transition-shadow overflow-hidden">
      {/* Report — top right corner */}
      <div className="absolute top-2 right-2 z-10">
        <ReportButton
          professorId={professor.id}
          professorName={professor.name}
        />
      </div>

      {/* Header */}
      <div className="flex items-start gap-3 p-4 pr-10">
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
              <Link
                href={professor.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600 transition-colors" />
              </Link>
            )}
          </div>
          <p className="text-sm text-gray-500 truncate">
            {[professor.faculty, professor.department]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>
      </div>

      {/* Metrics */}
      {(professor.ranking ||
        formattedCitations ||
        professor.accepting_students === "Yes") && (
        <div className="px-4 pb-2 flex items-center gap-2">
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
          {professor.accepting_students === "Yes" && (
            <span className="inline-flex items-center gap-1 text-xs font-medium bg-green-50 text-green-700 px-2 py-1 rounded-md select-none">
              <GraduationCap className="h-3 w-3" />
              Accepting Students
            </span>
          )}
        </div>
      )}

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
      <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 border-t mt-auto">
        {professor.email && (
          <div className="inline-flex items-center rounded-md">
            <Link
              href={`mailto:${professor.email}`}
              className="inline-flex items-center gap-1.5 border border-gray-200 rounded-l-md px-2.5 py-1.5 text-xs text-gray-600 hover:bg-gray-100 transition-colors bg-white"
            >
              <Mail className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Email</span>
            </Link>
            <button
              onClick={copyToClipboard}
              className="border border-l-0 border-gray-200 rounded-r-md px-2 py-1.5 inline-flex items-center bg-white text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Copy email"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-green-600" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        )}
        {professor.google_scholar && (
          <Link
            href={professor.google_scholar}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 border border-gray-200 rounded-md px-2.5 py-1.5 text-xs text-gray-600 hover:bg-gray-100 transition-colors bg-white"
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Scholar</span>
          </Link>
        )}
      </div>
    </div>
  )
}

export default ProfessorCard
