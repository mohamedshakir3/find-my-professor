import Image from "next/image"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { HeroSearch } from "@/components/hero-search"
import { createClient } from "@/utils/supabase/server"
import { GraduationCap, University } from "lucide-react"

async function getStats() {
  const supabase = await createClient()
  const [{ count }, { data: unis }] = await Promise.all([
    supabase.from("professors").select("*", { count: "exact", head: true }),
    supabase.from("professors").select("university").not("university", "is", null),
  ])
  const universityCount = new Set(unis?.map((r) => r.university)).size
  return { professorCount: count ?? 0, universityCount }
}

export default async function Home() {
  const { professorCount, universityCount } = await getStats()

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative bg-[#31404f] px-4 pb-28 pt-12 text-white md:px-6 md:pb-36 md:pt-16">
        <div className="mx-auto max-w-3xl px-4">
          <div className="flex flex-col items-center md:flex-row md:items-center md:gap-6">
            <div className="mb-8 max-w-xl text-center md:mb-0 md:text-left md:flex-1">
              <h1 className="mb-3 text-3xl font-bold md:text-4xl lg:text-5xl">
                Find a professor and connect with their expertise!
              </h1>
              <p className="text-white/70 text-sm md:text-base">
                Search across Canadian universities by name, research interest, or department.
              </p>
              <div className="mt-3 flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fdecea] px-3 py-1 text-xs font-medium text-[#e35535]">
                  <GraduationCap className="h-3.5 w-3.5" />
                  {professorCount.toLocaleString()}+ Professors
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fdecea] px-3 py-1 text-xs font-medium text-[#e35535]">
                  <University className="h-3.5 w-3.5" />
                  {universityCount} Universities
                </span>
              </div>
            </div>
            <div className="hidden md:block md:flex-shrink-0">
              <Image
                src="/professor-penguin.png"
                alt="Professor Penguin"
                width={180}
                height={180}
                className="transform -translate-y-2"
              />
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-1/2 w-full max-w-3xl px-4">
          <HeroSearch />
        </div>
      </section>

      {/* Features Section */}
      <section className="mt-16 px-4 py-12 md:mt-20 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-semibold md:text-3xl">
              Everything you need for your research journey,
              <br /> all in{" "}
              <span className="text-[#31404e] font-bold">one place</span>
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="overflow-hidden bg-neutral-100">
              <CardContent className="p-6">
                <div className="mb-4 h-48 overflow-hidden rounded-lg p-2">
                  <Image
                    src="/penguin-magnifying.png"
                    alt="Academic profiles illustration"
                    width={300}
                    height={300}
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
                    src="/penguin-book.PNG"
                    alt="Search illustration"
                    width={200}
                    height={200}
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
                    src="/penguin-laptop.png"
                    alt="Updates illustration"
                    width={200}
                    height={200}
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
