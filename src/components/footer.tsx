import Link from "next/link"
import { ExternalLink, ExternalLinkIcon, Github } from "lucide-react"
import { cn } from "@/lib/utils"

export function Footer({ className }: { className?: string }) {
  return (
    <footer className="mt-auto">
      {/* Wave SVG */}
      <div className={cn("w-full", className)}>
        <svg
          viewBox="0 0 1440 320"
          className="w-full mb-[-1px]"
          fill="#31404f"
          preserveAspectRatio="none"
        >
          <path d="M0,96L80,106.7C160,117,320,139,480,149.3C640,160,800,160,960,138.7C1120,117,1280,75,1360,53.3L1440,32L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
        </svg>

        {/* Footer content */}
        <div className="bg-[#31404f] text-white pb-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  About This Project
                </h3>
                <p className="text-white/80 text-sm">
                  A platform to help researchers and students find professors
                  based on research interests and expertise.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="https://github.com/mohamedshakir3/find-my-professor"
                      className="text-white/80 hover:text-white text-sm flex items-center gap-2"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="h-4 w-4" />
                      Main Project Repository
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://github.com/mohamedshakir3/find-my-professor-scraper"
                      className="text-white/80 hover:text-white text-sm flex items-center gap-2"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="h-4 w-4" />
                      Scraper Repository
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://raw.githubusercontent.com/mohamedshakir3/find-my-professor-scraper/refs/heads/master/universities.json"
                      className="text-white/80 hover:text-white text-sm flex items-center gap-2"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="flex-none">
                        Data collected from here
                      </span>
                      <ExternalLink className="h-4 w-4 flex-none" />
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Maintained By</h3>
                <p className="text-white/80 text-sm">
                  Developed and maintained by{" "}
                  <Link
                    href="https://github.com/mohamedshakir3"
                    className="underline hover:text-white"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Mohamed Shakir
                  </Link>
                  .
                </p>
                <p className="text-white/80 text-sm mt-2">
                  Last updated: 2025-03-31
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
