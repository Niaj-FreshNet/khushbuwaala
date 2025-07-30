import type React from "react"
import { ReactNode } from "react"

export default function Layout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <>
      {/* You can add homepage-specific layout elements here if needed.
          For now, it simply passes through the children. */}
      {children}
    </>
  )
}
