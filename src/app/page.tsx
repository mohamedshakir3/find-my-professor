"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { GraduationCap, Search } from "lucide-react"
import Link from "next/link"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

export default function Home() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/professors?q=${searchQuery}`)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative bg-[#4a6b63] px-4 pb-24 pt-12 text-white md:px-6 md:pb-32 md:pt-16">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col items-center md:flex-row md:justify-between">
            <div className="mb-8 max-w-xl text-center md:mb-0 md:text-left">
              <h1 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">
                Find a professor and connect with their expertise!
              </h1>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-1/2 w-full max-w-3xl px-4">
          <form
            onSubmit={handleSearch}
            className="flex w-full items-center gap-2 rounded-full bg-white p-2 shadow-lg"
          >
            <div className="flex w-full items-center gap-2 pl-4">
              <Search className="h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for a professor by research interests, university, etc."
                value={searchQuery}
                className="flex-1 border-0 bg-transparent text-gray-900 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              className="rounded-full bg-[#6b8680] hover:bg-[#5a7570]"
            >
              SEARCH
            </Button>
          </form>
        </div>
      </section>

      {/* Features Section */}
      <section className="mt-24 px-4 py-12 md:mt-32 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-semibold md:text-3xl">
              Everything you need for your research journey,
              <br /> all in{" "}
              <span className="text-[#3a5a52] font-bold">one place</span>
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="overflow-hidden bg-neutral-100">
              <CardContent className="p-6">
                <div className="mb-4 h-48 overflow-hidden rounded-lg p-2">
                  <Image
                    src="/hero-image-1.jpeg"
                    alt="Academic profiles illustration"
                    width={280}
                    height={180}
                    className="h-full w-full object-contain"
                  />
                </div>
                <h3 className="mb-2 font-medium">
                  Explore academic profiles to discover professors' research
                  interests and expertise.
                </h3>
              </CardContent>
            </Card>

            <Card className="overflow-hidden bg-neutral-100">
              <CardContent className="p-6">
                <div className="mb-4 h-48 overflow-hidden rounded-lg bg-gray-100 p-2">
                  <Image
                    src="/hero-image-2.jpeg"
                    alt="Search illustration"
                    width={280}
                    height={180}
                    className="h-full w-full object-contain"
                  />
                </div>
                <h3 className="mb-2 font-medium">
                  Save time and effort by getting all the information you need
                  in one place.
                </h3>
              </CardContent>
            </Card>

            <Card className="overflow-hidden bg-neutral-100">
              <CardContent className="p-6">
                <div className="mb-4 h-48 overflow-hidden rounded-lg bg-gray-100 p-2">
                  <Image
                    src="/hero-image-3.jpeg"
                    alt="Updates illustration"
                    width={280}
                    height={180}
                    className="h-full w-full object-contain"
                  />
                </div>
                <h3 className="mb-2 font-medium">
                  Stay updated with any changes in faculty contact info or
                  department assignments.
                </h3>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
