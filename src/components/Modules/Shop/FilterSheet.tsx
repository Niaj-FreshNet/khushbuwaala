"use client"

import { useEffect, useRef, useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Check, FilterIcon } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FilterSheetProps {
  visible: boolean
  onClose: (open: boolean) => void
  onApplyFilters: (filters: any) => void
  initialFilters?: {
    categoryName?: string
  }
  lockCategory?: boolean
}

export function FilterSheet({
  visible,
  onClose,
  onApplyFilters,
  initialFilters,
  lockCategory,
}: FilterSheetProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([100, 5000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialFilters?.categoryName ? [initialFilters.categoryName] : []
  )
  const [selectedSpecification, setSelectedSpecification] = useState<string>("all")
  const [selectedAccords, setSelectedAccords] = useState<string[]>([])
  const [selectedPerfumeNotes, setSelectedPerfumeNotes] = useState<string[]>([])
  const [selectedPerformance, setSelectedPerformance] = useState<string[]>([])
  const [selectedProjection, setSelectedProjection] = useState<string[]>([])

  const lockedCategory = initialFilters?.categoryName?.trim() || ""

  const CATEGORY_OPTIONS = [
    { value: "INSPIRED PERFUME OIL", label: "Inspired Perfume Oil" },
    { value: "ORIENTAL ATTAR", label: "Oriental & Arabian Attar" },
    { value: "ARTIFICIAL OUD", label: "Artificial Oud" },
    { value: "GIFTS AND PACKAGES", label: "Gifts & Packages" },
    { value: "NATURAL ATTAR", label: "Natural Attar" },
    { value: "ORGANIC ATTAR", label: "Organic Attar" },
  ]

  const visibleCategoryOptions =
    lockCategory && lockedCategory
      ? [{ value: lockedCategory, label: lockedCategory }]
      : CATEGORY_OPTIONS

  const prevFiltersRef = useRef({
    priceRange,
    selectedCategories,
    selectedSpecification,
    selectedAccords,
    selectedPerfumeNotes,
    selectedPerformance,
    selectedProjection,
  })

  useEffect(() => {
    const currentFilters = {
      priceRange,
      selectedCategories,
      selectedSpecification,
      selectedAccords,
      selectedPerfumeNotes,
      selectedPerformance,
      selectedProjection,
    }

    const changed =
      prevFiltersRef.current.priceRange[0] !== currentFilters.priceRange[0] ||
      prevFiltersRef.current.priceRange[1] !== currentFilters.priceRange[1] ||
      prevFiltersRef.current.selectedSpecification !== currentFilters.selectedSpecification ||
      prevFiltersRef.current.selectedCategories.join(",") !== currentFilters.selectedCategories.join(",") ||
      prevFiltersRef.current.selectedAccords.join(",") !== currentFilters.selectedAccords.join(",") ||
      prevFiltersRef.current.selectedPerfumeNotes.join(",") !== currentFilters.selectedPerfumeNotes.join(",") ||
      prevFiltersRef.current.selectedPerformance.join(",") !== currentFilters.selectedPerformance.join(",") ||
      prevFiltersRef.current.selectedProjection.join(",") !== currentFilters.selectedProjection.join(",")

    if (changed) {
      onApplyFilters(currentFilters)
      prevFiltersRef.current = currentFilters
    }
  }, [
    priceRange,
    selectedCategories,
    selectedSpecification,
    selectedAccords,
    selectedPerfumeNotes,
    selectedPerformance,
    selectedProjection,
    onApplyFilters,
  ])

  const handleReset = () => {
    const resetFilters = {
      priceRange: [100, 5000] as [number, number],
      selectedCategories:
        lockCategory && initialFilters?.categoryName
          ? [initialFilters.categoryName]
          : [],
      selectedSpecification: "all",
      selectedAccords: [],
      selectedPerfumeNotes: [],
      selectedPerformance: [],
      selectedProjection: [],
    }

    setPriceRange(resetFilters.priceRange)
    setSelectedCategories(resetFilters.selectedCategories)
    setSelectedSpecification(resetFilters.selectedSpecification)
    setSelectedAccords(resetFilters.selectedAccords)
    setSelectedPerfumeNotes(resetFilters.selectedPerfumeNotes)
    setSelectedPerformance(resetFilters.selectedPerformance)
    setSelectedProjection(resetFilters.selectedProjection)

    onApplyFilters(resetFilters)
  }

  const smellTypes = {
    smellAccords: [
      { value: "Corporate", label: "Corporate" },
      { value: "Refreshing", label: "Refreshing" },
      { value: "Manly", label: "Manly" },
      { value: "Floral", label: "Floral" },
      { value: "Fruity", label: "Fruity" },
      { value: "Sweet", label: "Sweet" },
      { value: "Spicy", label: "Spicy" },
      { value: "Strong", label: "Strong" },
    ],
    perfumeNotes: [
      { value: "Musk", label: "Musk" },
      { value: "Amber", label: "Amber" },
      { value: "Rose", label: "Rose" },
      { value: "Jasmine", label: "Jasmine" },
      { value: "Vanilla", label: "Vanilla" },
      { value: "Sandalwood", label: "Sandalwood" },
      { value: "Oud", label: "Oud" },
      { value: "Bergamot", label: "Bergamot" },
      { value: "Patchouli", label: "Patchouli" },
      { value: "Saffron", label: "Saffron" },
      { value: "Cedarwood", label: "Cedarwood" },
      { value: "Vetiver", label: "Vetiver" },
      { value: "Lavender", label: "Lavender" },
      { value: "Citrus", label: "Citrus" },
      { value: "Iris", label: "Iris" },
      { value: "Incense", label: "Incense" },
      { value: "Leather", label: "Leather" },
      { value: "Coconut", label: "Coconut" },
      { value: "Caramel", label: "Caramel" },
      { value: "Honey", label: "Honey" },
      { value: "Geranium", label: "Geranium" },
      { value: "Mint", label: "Mint" },
      { value: "Tonka Bean", label: "Tonka Bean" },
      { value: "Cinnamon", label: "Cinnamon" },
    ],
    performance: [
      { value: "BEAST_MODE", label: "Ultra (12h+)" },
      { value: "EXCELLENT", label: "Excellent (8-10h)" },
      { value: "GOOD", label: "Good (5-6h)" },
      { value: "MODERATE", label: "Moderate (3-4h)" },
    ],
    projection: [
      { value: "NUCLEAR", label: "Nuclear (10ft+)" },
      { value: "STRONG", label: "Strong (7-9ft)" },
      { value: "MODERATE", label: "Moderate (4-6ft)" },
      { value: "INTIMATE", label: "Intimate (1-2ft)" },
    ],
  }

  return (
    <Sheet open={visible} onOpenChange={onClose}>
      <SheetContent
        side="left"
        className="w-[88vw] max-w-[360px] flex flex-col h-full p-0 bg-gray-50 border-r"
      >
        <SheetHeader className="px-5 py-3.5 border-b bg-white shrink-0">
          <SheetTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
            <FilterIcon className="h-5 w-5 text-red-600" />
            Filter Products
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1 px-5 py-4 overflow-y-auto">
          <div className="flex flex-col space-y-5 pb-6">
            {/* Category Dropdown */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">
                Category
              </label>
              <Select
                disabled={!!lockCategory}
                value={selectedCategories[0] || "all"}
                onValueChange={(value) =>
                  setSelectedCategories(value === "all" ? [] : [value])
                }
              >
                <SelectTrigger className="w-full h-9 bg-white text-sm border-gray-200 rounded-lg">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {!lockCategory && <SelectItem value="all">All Categories</SelectItem>}
                  {visibleCategoryOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Specification Dropdown */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">
                For Whom
              </label>
              <Select
                value={selectedSpecification}
                onValueChange={setSelectedSpecification}
              >
                <SelectTrigger className="w-full h-9 bg-white text-sm border-gray-200 rounded-lg">
                  <SelectValue placeholder="For Men or Women?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="unisex">Unisex</SelectItem>
                  <SelectItem value="male">Men</SelectItem>
                  <SelectItem value="female">Women</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Filter Groups */}
            {Object.entries(smellTypes).map(([groupName, items]) => {
              const isSingleSelect = groupName === "performance" || groupName === "projection"
              const isChipLayout = groupName === "smellAccords" || groupName === "perfumeNotes"

              const selected =
                groupName === "smellAccords"
                  ? selectedAccords
                  : groupName === "perfumeNotes"
                    ? selectedPerfumeNotes
                    : groupName === "performance"
                      ? selectedPerformance
                      : selectedProjection

              const setSelected =
                groupName === "smellAccords"
                  ? setSelectedAccords
                  : groupName === "perfumeNotes"
                    ? setSelectedPerfumeNotes
                    : groupName === "performance"
                      ? setSelectedPerformance
                      : setSelectedProjection

              const handleToggle = (val: string) => {
                if (isSingleSelect) {
                  setSelected(selected.includes(val) ? [] : [val])
                } else {
                  setSelected((prev) =>
                    prev.includes(val) ? prev.filter((s) => s !== val) : [...prev, val]
                  )
                }
              }

              return (
                <div key={groupName} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500 capitalize">
                      {groupName.replace(/([A-Z])/g, " $1")}
                    </span>
                    {selected.length > 0 && (
                      <span className="text-xs font-semibold text-red-600">
                        {selected.length} selected
                      </span>
                    )}
                  </div>

                  {/* Accords & Perfume Notes as Multi-select Chips/Pills */}
                  {isChipLayout ? (
                    <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
                      {items.map((item) => {
                        const checked = selected.includes(item.value)
                        return (
                          <button
                            key={item.value}
                            type="button"
                            onClick={() => handleToggle(item.value)}
                            className={cn(
                              "inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md border font-medium transition-all active:scale-95",
                              checked
                                ? "bg-red-500 border-red-500 text-white font-semibold shadow-xs"
                                : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                            )}
                          >
                            {checked && <Check className="w-3 h-3 stroke-[3]" />}
                            {item.label}
                          </button>
                        )
                      })}
                    </div>
                  ) : (
                    /* Performance & Projection in clean 2-column grid */
                    <div className="grid grid-cols-2 gap-1.5">
                      {items.map((item) => {
                        const checked = selected.includes(item.value)
                        return (
                          <button
                            key={item.value}
                            type="button"
                            onClick={() => handleToggle(item.value)}
                            className={cn(
                              "text-xs px-2.5 py-2 rounded-lg border text-left font-medium transition-all truncate active:scale-98",
                              checked
                                ? "bg-red-50 border-red-500 text-red-700 font-semibold shadow-xs"
                                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                            )}
                          >
                            {item.label}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}

            <Separator />

            {/* Price Range */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block">
                Price Range
              </label>
              <Slider
                min={100}
                max={5000}
                step={50}
                value={priceRange}
                onValueChange={(value) => setPriceRange(value as [number, number])}
                className="w-full py-1"
              />
              <div className="flex justify-between items-center text-xs font-semibold text-gray-700">
                <span>৳ {priceRange[0]}</span>
                <span>৳ {priceRange[1]}</span>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer Actions */}
        <div className="p-4 border-t bg-white shrink-0 flex gap-2">
          <Button
            variant="outline"
            className="flex-1 h-10 border-gray-200 text-xs font-semibold hover:bg-gray-100"
            onClick={handleReset}
          >
            Reset
          </Button>
          <Button
            className="flex-1 h-10 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold"
            onClick={() => onClose(false)}
          >
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}