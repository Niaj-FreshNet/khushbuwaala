"use client"

import type React from "react"

import { useState } from "react"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// Client Component - Only for form interactivity
export default function NewsletterForm () {
  const [email, setEmail] = useState("")
  const [isSubscribing, setIsSubscribing] = useState(false)

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubscribing(true)

    try {
      // API call to subscribe user
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setEmail("")
        // Show success message (you can implement toast notification)
      }
    } catch (error) {
      console.error("Newsletter subscription failed:", error)
    } finally {
      setIsSubscribing(false)
    }
  }

  return (
    <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <Input
        type="email"
        placeholder="Enter your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="flex-1 h-12 px-4 border-2 border-red-200 focus:border-red-500 rounded-lg"
        aria-label="Email address for newsletter"
      />
      <Button
        type="submit"
        disabled={isSubscribing}
        className="h-12 px-6 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubscribing ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Subscribing...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            Subscribe
            <ArrowRight className="h-4 w-4" />
          </div>
        )}
      </Button>
    </form>
  )
}
