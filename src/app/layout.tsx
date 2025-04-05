import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import Link from "next/link"
import Image from "next/image"
const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Find My Professor",
  description: "Find professors and connect with their expertise",
  openGraph: {
    title: "Find My Professor",
    description: "Find professors and connect with their expertise.",
    url: "https://www.findmyprofessor.ca",
    images: ["https://www.findmyprofessor.ca/thumbnail.png"],
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-title" content="findmyprof" />
        <meta
          name="thumbnail"
          content="https://www.findmyprofessor.ca/thumbnail.png"
        />
      </head>
      <body className={inter.className}>
        <header className="w-full border-b bg-[#31404f] shadow-sm">
          <div className="container flex h-16 items-center justify-between px-4 md:px-6">
            <Link
              href="/"
              className="flex items-center gap-2 transition-opacity hover:opacity-90"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                <Image
                  src="/penguin-icon.PNG"
                  alt="Professor Icon"
                  width={60}
                  height={60}
                  className="h-full w-full object-cover rounded-full"
                />
                {/* <GraduationCap className="h-6 w-6 text-white" /> */}
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold leading-none text-white">
                  Find my Professor
                </span>
                <span className="text-xs text-white/70">
                  Connect with academic expertise
                </span>
              </div>
            </Link>
          </div>
        </header>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
