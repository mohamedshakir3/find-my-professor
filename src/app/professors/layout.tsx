import { TransitionProvider } from "@/hooks/use-shared-transition"
import "@/app/globals.css"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <TransitionProvider>{children}</TransitionProvider>
}
