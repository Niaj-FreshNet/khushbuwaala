import BottomBar from "@/components/Shared/BottomBar"
import { Footer } from "@/components/Shared/Footer"
import { Navbar } from "@/components/Shared/Navbar"
import { ReactNode } from "react"

export default function Layout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Navigation (fixed at top) */}
      <Navbar />

      {/* Main content area */}
      {/* pt-16 to account for fixed navbar height (h-16) */}
      {/* pb-16 to account for fixed bottom bar height (h-16) on mobile */}
      <main className="flex-1 w-full max-w-full mx-auto pt-16 pb-16">{children}</main>

      {/* Footer */}
      <Footer />

      {/* Mobile Bottom Bar (fixed at bottom, hidden on large screens) */}
      <BottomBar />
    </div>
  )
}
