import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft, Search } from "lucide-react"

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-6">
            <div className="text-center max-w-xl">
                {/* Big 404 */}
                <h1 className="text-7xl md:text-8xl font-bold tracking-tight text-primary">
                    404
                </h1>

                {/* Title */}
                <h2 className="mt-6 text-2xl md:text-3xl font-semibold">
                    Page not found
                </h2>

                {/* Subtitle */}
                <p className="mt-3 text-muted-foreground text-sm md:text-base">
                    Sorry, we couldn’t find the page you’re looking for.
                    It may have been moved, deleted, or the URL is incorrect.
                </p>

                {/* Actions */}
                <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/">
                        <Button className="gap-2">
                            <Home size={16} />
                            Back Home
                        </Button>
                    </Link>

                    <Button
                        variant="outline"
                        onClick={() => window.history.back()}
                        className="gap-2"
                    >
                        <ArrowLeft size={16} />
                        Go Back
                    </Button>
                </div>

                {/* Helper text */}
                <p className="mt-6 text-xs text-muted-foreground flex items-center justify-center gap-1">
                    <Search size={14} />
                    Try searching for a product instead
                </p>
            </div>
        </div>
    )
}
