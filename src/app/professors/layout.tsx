import { TransitionProvider } from "@/hooks/use-shared-transition"
import { Footer } from "@/components/footer"
import "@/app/globals.css"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <TransitionProvider>
      {children}
      <Footer className="bg-gray-50" />
    </TransitionProvider>
  )
}
