"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider" // Assuming a shadcn/ui Slider or custom implementation
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FilterIcon, X } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

interface FilterSheetProps {
  visible: boolean
  onClose: (open: boolean) => void
  onApplyFilters: (filters: any) => void
}

export function FilterSheet({ visible, onClose, onApplyFilters }: FilterSheetProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([100, 5000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedSmells, setSelectedSmells] = useState<string[]>([])
  const [selectedSpecification, setSelectedSpecification] = useState<string>("all")

  const handleApply = () => {
    onApplyFilters({
      priceRange,
      selectedCategories,
      selectedSmells,
      selectedSpecification,
    })
    onClose(false)
  }

  const handleCategoryChange = (value: string) => {
    setSelectedCategories(value === "all" ? [] : [value])
  }

  const handleSmellChange = (smell: string, checked: boolean) => {
    setSelectedSmells((prev) => (checked ? [...prev, smell] : prev.filter((s) => s !== smell)))
  }

  const smellTypes = {
    performance: ["Projective", "Longetive", "Nostalgic", "Synthetic", "Organic"],
    mainAccords: ["Corporate", "Refreshing", "Manly", "Floral", "Fruity", "Sweet", "Spicy", "Strong"],
    notes: [
      "Citrusy",
      "Earthy",
      "Leathery",
      "Soapy",
      "Chocolate",
      "Vanilla",
      "Candy",
      "Powdery",
      "Bergamote",
      "Lavender",
      "Vetiver",
      "Woody",
      "Smooky",
      "Amber",
      "Musky",
    ],
  }

  return (
    <Sheet open={visible} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[320px] sm:w-[380px] flex flex-col p-0 bg-gray-50">
        <SheetHeader className="px-6 py-4 border-b bg-gradient-to-r from-red-50 to-pink-50">
          <SheetTitle className="flex items-center justify-between text-xl">
            <div className="flex items-center gap-2">
              <FilterIcon className="h-6 w-6 text-red-600" />
              Filter Products
            </div>
            {/* <Button variant="ghost" size="icon" onClick={() => onClose(false)} aria-label="Close filters">
              <X className="h-5 w-5" />
            </Button> */}
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6 py-4">
          <div className="flex flex-col space-y-6">
            {/* Category Filter */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Category</h4>
              <Select value={selectedCategories[0] || "all"} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-full h-10 bg-white border-gray-200 rounded-md">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="inspiredPerfumeOil">Inspired Perfume Oil</SelectItem>
                  <SelectItem value="oriental">Oriental & Arabian Attar</SelectItem>
                  <SelectItem value="artificialOud">Artificial Oud</SelectItem>
                  <SelectItem value="natural">Natural Collections</SelectItem>
                  <SelectItem value="brand">Brand</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Smell Filters */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Smell Accords</h4>
              {Object.entries(smellTypes).map(([groupName, smells]) => (
                <div key={groupName} className="mb-4">
                  <h5 className="font-medium text-gray-700 mb-2 capitalize">{groupName.replace(/([A-Z])/g, " $1")}</h5>
                  <div className="grid grid-cols-2 gap-2">
                    {smells.map((smell) => (
                      <div key={smell} className="flex items-center space-x-2">
                        <Checkbox
                          id={`smell-${smell}`}
                          checked={selectedSmells.includes(smell)}
                          onCheckedChange={(checked) => handleSmellChange(smell, checked as boolean)}
                        />
                        <Label htmlFor={`smell-${smell}`} className="text-sm text-gray-600 cursor-pointer">
                          {smell}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            {/* Specification Filter */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Specification</h4>
              <Select value={selectedSpecification} onValueChange={setSelectedSpecification}>
                <SelectTrigger className="w-full h-10 bg-white border-gray-200 rounded-md">
                  <SelectValue placeholder="For Men or Women?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="male">For Men</SelectItem>
                  <SelectItem value="female">For Women</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Price Filter */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Price Range</h4>
              <Slider
                min={100}
                max={5000}
                step={50}
                value={priceRange}
                onValueChange={(value: number[]) => setPriceRange(value as [number, number])}
                className="w-full"
              />
              <p className="text-sm text-gray-600 mt-2">
                BDT {priceRange[0]} - {priceRange[1]}
              </p>
            </div>
          </div>
        </ScrollArea>

        <div className="p-6 border-t bg-white">
          <Button
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition-colors"
            onClick={handleApply}
          >
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
