"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export function HeroSearch() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setIsLoading(true)
      router.push(`/professors?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 z-10" />
      <Input
        type="text"
        placeholder="Search by name, research interest, university..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        disabled={isLoading}
        className="h-14 w-full pl-12 pr-4 rounded-xl border border-gray-200 bg-white text-base text-gray-900 shadow-lg focus-visible:ring-2 focus-visible:ring-[#31404f] focus-visible:border-transparent"
      />
      {isLoading && (
        <Loader2 className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 animate-spin" />
      )}
    </form>
  )
}
