"use client"

import { useState } from "react"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function NewsletterForm() {
  const [email, setEmail] = useState("")
  const [isSubscribing, setIsSubscribing] = useState(false)

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubscribing(true)

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setEmail("")
        // You can show a toast here for success
      }
    } catch (error) {
      console.error("Newsletter subscription failed:", error)
    } finally {
      setIsSubscribing(false)
    }
  }

  return (
    <form
      onSubmit={handleNewsletterSubmit}
      className="flex items-center max-w-md mx-auto w-full bg-white shadow-sm border border-red-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-red-400 transition-all"
    >
      <Input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-5 h-12 text-sm md:text-base placeholder:text-gray-400"
        aria-label="Email address for newsletter"
      />
      <Button
        type="submit"
        disabled={isSubscribing}
        className="h-12 px-6 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-none transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
      >
        {isSubscribing ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-lg animate-spin" />
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
