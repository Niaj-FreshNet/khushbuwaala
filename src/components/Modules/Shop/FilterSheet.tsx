"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { SlidersHorizontal, X, RotateCcw, Sparkles, Tag, DollarSign, Users, Palette } from "lucide-react"
import { cn } from "@/lib/utils"

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

  const categories = [
    { value: "inspiredPerfumeOil", label: "Inspired Perfume Oil", count: 45 },
    { value: "oriental", label: "Oriental & Arabian Attar", count: 32 },
    { value: "artificialOud", label: "Artificial Oud", count: 28 },
    { value: "natural", label: "Natural Collections", count: 19 },
    { value: "brand", label: "Brand Collection", count: 15 },
  ]

  const smellGroups = {
    performance: {
      title: "Performance",
      icon: <Sparkles className="h-4 w-4" />,
      items: ["Projective", "Longetive", "Nostalgic", "Synthetic", "Organic"],
    },
    mainAccords: {
      title: "Main Accords",
      icon: <Palette className="h-4 w-4" />,
      items: ["Corporate", "Refreshing", "Manly", "Floral", "Fruity", "Sweet", "Spicy", "Strong"],
    },
    notes: {
      title: "Fragrance Notes",
      icon: <Tag className="h-4 w-4" />,
      items: [
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
    },
  }

  const handleApply = () => {
    onApplyFilters({
      priceRange,
      selectedCategories,
      selectedSmells,
      selectedSpecification,
    })
    onClose(false)
  }

  const handleReset = () => {
    setPriceRange([100, 5000])
    setSelectedCategories([])
    setSelectedSmells([])
    setSelectedSpecification("all")
  }

  const handleCategoryChange = (value: string) => {
    setSelectedCategories(value === "all" ? [] : [value])
  }

  const handleSmellChange = (smell: string, checked: boolean) => {
    setSelectedSmells((prev) => (checked ? [...prev, smell] : prev.filter((s) => s !== smell)))
  }

  const totalActiveFilters =
    selectedCategories.length +
    selectedSmells.length +
    (selectedSpecification !== "all" ? 1 : 0) +
    (priceRange[0] !== 100 || priceRange[1] !== 5000 ? 1 : 0)

  return (
    <Sheet open={visible} onOpenChange={onClose}>
      <SheetContent
        side="left"
        className="w-[380px] sm:w-[420px] flex flex-col p-0 bg-gradient-to-b from-white to-gray-50/50"
      >
        {/* Enhanced Header */}
        <SheetHeader className="px-6 py-5 border-b bg-gradient-to-r from-red-50 via-pink-50 to-purple-50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-100/20 to-purple-100/20 blur-xl"></div>
          <SheetTitle className="flex items-center justify-between text-xl relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/80 rounded-xl shadow-sm">
                <SlidersHorizontal className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <span className="font-bold text-gray-900">Filter Products</span>
                {totalActiveFilters > 0 && (
                  <Badge className="ml-2 bg-red-100 text-red-700 text-xs">{totalActiveFilters} active</Badge>
                )}
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => onClose(false)} className="hover:bg-white/50 rounded-xl">
              <X className="h-5 w-5" />
            </Button>
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6 py-6">
          <div className="space-y-8">
            {/* Category Filter */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="h-5 w-5 text-blue-600" />
                <h4 className="text-lg font-bold text-gray-800">Category</h4>
              </div>
              <Select value={selectedCategories[0] || "all"} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-full h-12 bg-white/80 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all" className="rounded-lg">
                    <div className="flex items-center justify-between w-full">
                      <span>All Categories</span>
                      <Badge variant="outline" className="text-xs">
                        {categories.reduce((sum, cat) => sum + cat.count, 0)}
                      </Badge>
                    </div>
                  </SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value} className="rounded-lg">
                      <div className="flex items-center justify-between w-full">
                        <span>{category.label}</span>
                        <Badge variant="outline" className="text-xs">
                          {category.count}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator className="bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

            {/* Smell Filters */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-purple-600" />
                <h4 className="text-lg font-bold text-gray-800">Fragrance Profile</h4>
              </div>

              {Object.entries(smellGroups).map(([groupKey, group]) => (
                <div key={groupKey} className="space-y-3">
                  <div className="flex items-center gap-2">
                    {group.icon}
                    <h5 className="font-semibold text-gray-700">{group.title}</h5>
                    {selectedSmells.filter((smell) => group.items.includes(smell)).length > 0 && (
                      <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">
                        {selectedSmells.filter((smell) => group.items.includes(smell)).length}
                      </Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {group.items.map((smell) => (
                      <div key={smell} className="flex items-center space-x-2">
                        <Checkbox
                          id={`smell-${smell}`}
                          checked={selectedSmells.includes(smell)}
                          onCheckedChange={(checked) => handleSmellChange(smell, checked as boolean)}
                          className="rounded-md"
                        />
                        <Label
                          htmlFor={`smell-${smell}`}
                          className={cn(
                            "text-sm cursor-pointer transition-colors duration-200",
                            selectedSmells.includes(smell)
                              ? "text-purple-700 font-medium"
                              : "text-gray-600 hover:text-gray-800",
                          )}
                        >
                          {smell}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <Separator className="bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

            {/* Specification Filter */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                <h4 className="text-lg font-bold text-gray-800">Target Audience</h4>
              </div>
              <Select value={selectedSpecification} onValueChange={setSelectedSpecification}>
                <SelectTrigger className="w-full h-12 bg-white/80 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                  <SelectValue placeholder="For whom?" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all" className="rounded-lg">
                    All Audiences
                  </SelectItem>
                  <SelectItem value="male" className="rounded-lg">
                    For Men
                  </SelectItem>
                  <SelectItem value="female" className="rounded-lg">
                    For Women
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator className="bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

            {/* Price Filter */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-yellow-600" />
                <h4 className="text-lg font-bold text-gray-800">Price Range</h4>
              </div>
              <div className="px-3">
                <Slider
                  min={100}
                  max={5000}
                  step={50}
                  value={priceRange}
                  onValueChange={(value: number[]) => setPriceRange(value as [number, number])}
                  className="w-full"
                />
                <div className="flex justify-between items-center mt-4">
                  <div className="bg-gray-100 px-3 py-2 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">৳{priceRange[0]}</span>
                  </div>
                  <div className="text-gray-400">—</div>
                  <div className="bg-gray-100 px-3 py-2 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">৳{priceRange[1]}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Enhanced Footer */}
        <div className="p-6 border-t bg-white/80 backdrop-blur-sm space-y-3">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex-1 bg-white hover:bg-gray-50 border-gray-300 text-gray-700 rounded-xl py-3 transition-all duration-300"
              disabled={totalActiveFilters === 0}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button
              onClick={handleApply}
              className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
            >
              Apply Filters
              {totalActiveFilters > 0 && (
                <Badge className="ml-2 bg-white/20 text-white text-xs">{totalActiveFilters}</Badge>
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-500 text-center">Filters help you find exactly what you're looking for</p>
        </div>
      </SheetContent>
    </Sheet>
  )
}
