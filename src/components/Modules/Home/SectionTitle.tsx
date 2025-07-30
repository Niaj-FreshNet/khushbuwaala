import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface SectionTitleProps {
  title: string
  underlineWidth?: string
  className?: string
}

// Server Component - Purely presentational
export function SectionTitle({ title, underlineWidth = "w-36", className }: SectionTitleProps) {
  return (
    <div className={cn("text-center py-4", className)}>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 relative">{title}</h2>
      <Separator className={cn("h-1 bg-red-500 mx-auto rounded-full", underlineWidth)} />
    </div>
  )
}
