"use client"

import { useEffect, useRef, useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FilterIcon } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils";

interface FilterSheetProps {
  visible: boolean
  onClose: (open: boolean) => void
  onApplyFilters: (filters: any) => void
  initialFilters?: {
    categoryName?: string;
  };
  lockCategory?: boolean; // ✅ add
}

export function FilterSheet({
  visible,
  onClose,
  onApplyFilters,
  initialFilters,
  lockCategory,
}: FilterSheetProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([100, 5000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialFilters?.categoryName ? [initialFilters.categoryName] : []);
  const [selectedSpecification, setSelectedSpecification] = useState<string>("all");
  const [selectedAccords, setSelectedAccords] = useState<string[]>([]);
  const [selectedPerfumeNotes, setSelectedPerfumeNotes] = useState<string[]>([]);
  const [selectedPerformance, setSelectedPerformance] = useState<string[]>([]);

  // put near the top of component
  const lockedCategory = initialFilters?.categoryName?.trim() || "";

  // your normal categories should match DB categoryName exactly
  const CATEGORY_OPTIONS = [
    { value: "INSPIRED PERFUME OIL", label: "Inspired Perfume Oil" },
    { value: "ORIENTAL ATTAR", label: "Oriental & Arabian Attar" },
    { value: "ARTIFICIAL OUD", label: "Artificial Oud" },
    { value: "GIFTS AND PACKAGES", label: "Gifts & Packages" },
    { value: "NATURAL ATTAR", label: "Natural Attar" },
    { value: "ORGANIC ATTAR", label: "Organic Attar" },
  ];

  // If locked, show only locked option
  const visibleCategoryOptions =
    lockCategory && lockedCategory
      ? [{ value: lockedCategory, label: lockedCategory }]
      : CATEGORY_OPTIONS;

  // optional: label pretty
  const getCategoryLabel = (val: string) =>
    CATEGORY_OPTIONS.find(o => o.value === val)?.label ?? val;

  // inside FilterSheet
  const prevFiltersRef = useRef({
    priceRange,
    selectedCategories,
    selectedSpecification,
    selectedAccords,
    selectedPerfumeNotes,
    selectedPerformance,
  });

  useEffect(() => {
    const currentFilters = {
      priceRange,
      selectedCategories,
      selectedSpecification,
      selectedAccords,
      selectedPerfumeNotes,
      selectedPerformance,
    };

    const changed =
      prevFiltersRef.current.priceRange[0] !== currentFilters.priceRange[0] ||
      prevFiltersRef.current.priceRange[1] !== currentFilters.priceRange[1] ||
      prevFiltersRef.current.selectedSpecification !== currentFilters.selectedSpecification ||
      prevFiltersRef.current.selectedCategories.join(",") !== currentFilters.selectedCategories.join(",") ||
      prevFiltersRef.current.selectedAccords.join(",") !== currentFilters.selectedAccords.join(",") ||
      prevFiltersRef.current.selectedPerfumeNotes.join(",") !== currentFilters.selectedPerfumeNotes.join(",") ||
      prevFiltersRef.current.selectedPerformance.join(",") !== currentFilters.selectedPerformance.join(",");

    if (changed) {
      onApplyFilters(currentFilters);
      prevFiltersRef.current = currentFilters;
    }
  }, [
    priceRange,
    selectedCategories,
    selectedSpecification,
    selectedAccords,
    selectedPerfumeNotes,
    selectedPerformance,
    onApplyFilters,
  ]);

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
    };

    setPriceRange(resetFilters.priceRange);
    setSelectedCategories(resetFilters.selectedCategories);
    setSelectedSpecification(resetFilters.selectedSpecification);
    setSelectedAccords(resetFilters.selectedAccords);
    setSelectedPerfumeNotes(resetFilters.selectedPerfumeNotes);
    setSelectedPerformance(resetFilters.selectedPerformance);

    onApplyFilters(resetFilters);
  };

  const smellTypes = {
    smellAccords: [
      "Corporate",
      "Refreshing",
      "Manly",
      "Floral",
      "Fruity",
      "Sweet",
      "Spicy",
      "Strong",
    ],
    perfumeNotes: [
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
    performance: [
      "Projective",
      "Longetive",
      "Nostalgic",
      "Synthetic",
      "Organic",
    ],
  };

  return (
    <Sheet open={visible} onOpenChange={onClose}>
      <SheetContent
        side="left"
        className="w-[320px] sm:w-[380px] flex flex-col h-full p-0 bg-gray-50"
      >
        <SheetHeader className="px-6 py-4 border-b bg-gradient-to-r from-red-50 to-pink-50">
          <SheetTitle className="flex items-center gap-2 text-xl">
            <FilterIcon className="h-6 w-6 text-red-600" />
            Filter Products
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6 py-4 overflow-auto">
          <div className="flex flex-col space-y-6 pb-4">
            <Collapsible defaultOpen>
              <CollapsibleTrigger className="text-md font-semibold text-gray-800 mb-3">
                Category
              </CollapsibleTrigger>
              <CollapsibleContent>
                <Select
                  disabled={!!lockCategory}
                  value={selectedCategories[0] || "all"}
                  onValueChange={(value) =>
                    setSelectedCategories(value === "all" ? [] : [value])
                  }
                >
                  <SelectTrigger className="w-full h-10 bg-white border-gray-200 rounded-md">
                    {/* show locked label nicely */}
                    <SelectValue placeholder="Select Category">
                    </SelectValue>
                  </SelectTrigger>

                  <SelectContent>
                    {/* Hide "all" when locked (optional but cleaner) */}
                    {!lockCategory && <SelectItem value="all">All Categories</SelectItem>}

                    {visibleCategoryOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CollapsibleContent>
            </Collapsible>

            <Separator />

            <Collapsible defaultOpen>
              <CollapsibleContent>
                {Object.entries(smellTypes).map(([groupName, smells]) => {
                  const selected =
                    groupName === "smellAccords"
                      ? selectedAccords
                      : groupName === "perfumeNotes"
                        ? selectedPerfumeNotes
                        : selectedPerformance;

                  const setSelected =
                    groupName === "smellAccords"
                      ? setSelectedAccords
                      : groupName === "perfumeNotes"
                        ? setSelectedPerfumeNotes
                        : setSelectedPerformance;

                  return (
                    <div key={groupName} className="mb-6">
                      <h5 className="text-md font-semibold text-gray-800 mb-0 capitalize">
                        {groupName.replace(/([A-Z])/g, " $1")}
                      </h5>
                      <div className="h-1 w-64 lg:w-72 mb-4 rounded-full bg-gradient-to-r from-pink-500 via-pink-600 to-purple-600" />

                      <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
                        {smells.map((smell) => {
                          const id = `${groupName}-${smell}`
                          const checked = selected.includes(smell)

                          return (
                            <Label
                              key={smell}
                              htmlFor={id}
                              className={cn(
                                // whole row becomes clickable
                                "flex items-center gap-3 cursor-pointer select-none",
                                "rounded-xl border px-3 py-3 bg-white",
                                "transition-all duration-150",
                                "hover:border-primary/50 hover:bg-primary/5 active:scale-[0.99]",
                                checked && "border-primary bg-primary/10"
                              )}
                            >
                              <Checkbox
                                id={id}
                                checked={checked}
                                onCheckedChange={(isChecked) => {
                                  setSelected((prev) =>
                                    isChecked ? [...prev, smell] : prev.filter((s) => s !== smell)
                                  )
                                }}
                              />

                              <span className="text-sm font-medium text-gray-700 flex-1">
                                {smell}
                              </span>
                            </Label>
                          )
                        })}
                      </div>
                    </div>
                  );
                })}
              </CollapsibleContent>
            </Collapsible>

            <Separator />

            <Collapsible defaultOpen>
              <CollapsibleTrigger className="text-md font-semibold text-gray-800 mb-3">
                Specification
              </CollapsibleTrigger>
              <CollapsibleContent>
                <Select
                  value={selectedSpecification}
                  onValueChange={setSelectedSpecification}
                >
                  <SelectTrigger className="w-full h-10 bg-white border-gray-200 rounded-md">
                    <SelectValue placeholder="For Men or Women?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="male">For Men</SelectItem>
                    <SelectItem value="female">For Women</SelectItem>
                  </SelectContent>
                </Select>
              </CollapsibleContent>
            </Collapsible>

            <Separator />

            <Collapsible defaultOpen>
              <CollapsibleTrigger className="text-md font-semibold text-gray-800 mb-3">
                Price Range
              </CollapsibleTrigger>
              <CollapsibleContent>
                <Slider
                  min={100}
                  max={5000}
                  step={50}
                  value={priceRange}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                  className="w-full"
                />
                <p className="text-sm text-gray-600 mt-2">
                  BDT {priceRange[0]} - {priceRange[1]}
                </p>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </ScrollArea>

        <div className="p-6 pt-0 bg-white shrink-0 flex">
          <Button
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition-colors cursor-pointer"
            onClick={handleReset}
          >
            Reset
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}