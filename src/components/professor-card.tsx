import Image from "next/image"
import { Mail, ExternalLink, Check, University } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import Link from "next/link"

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
  }

  return (
    <div
      key={professor.id}
      className="flex flex-col overflow-hidden bg-white rounded-lg border hover:shadow-md transition-shadow"
    >
      <div className="bg-[#31404f] p-4 text-white rounded-t-lg">
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
      </div>
      <div className="flex-grow p-4">
        <div className="flex flex-wrap gap-2">
          {professor.research_interests?.map(
            (interest: any, index: number) => (
              <Badge
                key={index}
                variant="outline"
                className="rounded-md bg-[#fdecea] text-[#e35535] hover:bg-[#f8d3cf] border-[#e35535]/20 text-xs whitespace-normal break-words max-w-full"
              >
                {interest}
              </Badge>
            )
          )}
        </div>
      </div>
      <div className="flex justify-between bg-gray-50 px-4 py-3 rounded-b-lg">
        {professor.email ? (
          <Button
            variant="outline"
            size="sm"
            className="gap-1 text-[#31404f] border-[#31404f]/30 hover:bg-[#e8f0ee] hover:text-[#3a5a52]"
            onClick={copyToClipboard}
          >
            {copied ? <Check size={14} /> : <Mail size={14} />}
            <span className="hidden sm:inline">Contact</span>
          </Button>
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
