"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ListFilter, X } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface SortSheetProps {
  visible: boolean
  onClose: (open: boolean) => void
  onSortChange: (sortOption: string) => void
}

export function SortSheet({ visible, onClose, onSortChange }: SortSheetProps) {
  const sortOptions = [
    { label: "New Arrivals", value: "newArrival" },
    { label: "Best Selling", value: "featured" },
    { label: "On Sale", value: "onSale" },
    { label: "Alphabetically, A-Z", value: "a-z" },
    { label: "Alphabetically, Z-A", value: "z-a" },
    { label: "Price, low to high", value: "low-to-high" },
    { label: "Price, high to low", value: "high-to-low" },
    { label: "Date, old to new", value: "old-to-new" },
    { label: "Date, new to old", value: "new-to-old" },
  ]

  const [selectedSort, setSelectedSort] = useState("new-to-old")

  const handleSortSelect = (value: string) => {
    setSelectedSort(value)
    onSortChange(value)
    onClose(false)
  }

  return (
    <Sheet open={visible} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[380px] flex flex-col p-0 bg-gray-50">
        <SheetHeader className="px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <SheetTitle className="flex items-center justify-between text-xl">
            <div className="flex items-center gap-2">
              <ListFilter className="h-6 w-6 text-blue-600" />
              Sort By
            </div>
            <Button variant="ghost" size="icon" onClick={() => onClose(false)} aria-label="Close sort options">
              <X className="h-5 w-5" />
            </Button>
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6 py-4">
          <RadioGroup value={selectedSort} onValueChange={handleSortSelect} className="space-y-3">
            {sortOptions.map((option) => (
              <div
                key={option.value}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <RadioGroupItem value={option.value} id={`sort-${option.value}`} />
                <Label htmlFor={`sort-${option.value}`} className="text-base font-medium text-gray-800 cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
