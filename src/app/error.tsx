"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCcw, Home, Bug } from "lucide-react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("App Error:", error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="text-center max-w-xl">
        {/* Icon */}
        <div className="flex justify-center mb-6 text-destructive">
          <Bug size={56} />
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-semibold">
          Something went wrong
        </h1>

        {/* Description */}
        <p className="mt-3 text-muted-foreground text-sm md:text-base">
          An unexpected error occurred. Don’t worry — you can try again or go
          back to the homepage.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} className="gap-2">
            <RefreshCcw size={16} />
            Try Again
          </Button>

          <Link href="/">
            <Button variant="outline" className="gap-2">
              <Home size={16} />
              Back Home
            </Button>
          </Link>
        </div>

        {/* Optional dev info (hidden in production automatically if you want) */}
        {/* {process.env.NODE_ENV === "development" && (
          <pre className="mt-6 text-xs text-red-500 bg-muted p-3 rounded-md overflow-auto text-left">
            {error.message}
          </pre>
        )} */}
      </div>
    </div>
  )
}
