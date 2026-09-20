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
import { ChevronDown, FilterIcon } from "lucide-react"
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
  lockCategory?: boolean;
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
  const [selectedProjection, setSelectedProjection] = useState<string[]>([]);

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    smellAccords: true,
    perfumeNotes: false,
    performance: true,
    projection: true,
  });

  const toggleGroup = (groupName: string) =>
    setOpenGroups((prev) => ({ ...prev, [groupName]: !prev[groupName] }));

  const lockedCategory = initialFilters?.categoryName?.trim() || "";

  const CATEGORY_OPTIONS = [
    { value: "INSPIRED PERFUME OIL", label: "Inspired Perfume Oil" },
    { value: "ORIENTAL ATTAR", label: "Oriental & Arabian Attar" },
    { value: "ARTIFICIAL OUD", label: "Artificial Oud" },
    { value: "GIFTS AND PACKAGES", label: "Gifts & Packages" },
    { value: "NATURAL ATTAR", label: "Natural Attar" },
    { value: "ORGANIC ATTAR", label: "Organic Attar" },
  ];

  const visibleCategoryOptions =
    lockCategory && lockedCategory
      ? [{ value: lockedCategory, label: lockedCategory }]
      : CATEGORY_OPTIONS;

  const getCategoryLabel = (val: string) =>
    CATEGORY_OPTIONS.find(o => o.value === val)?.label ?? val;

  const prevFiltersRef = useRef({
    priceRange,
    selectedCategories,
    selectedSpecification,
    selectedAccords,
    selectedPerfumeNotes,
    selectedPerformance,
    selectedProjection,
  });

  useEffect(() => {
    const currentFilters = {
      priceRange,
      selectedCategories,
      selectedSpecification,
      selectedAccords,
      selectedPerfumeNotes,
      selectedPerformance,
      selectedProjection,
    };

    const changed =
      prevFiltersRef.current.priceRange[0] !== currentFilters.priceRange[0] ||
      prevFiltersRef.current.priceRange[1] !== currentFilters.priceRange[1] ||
      prevFiltersRef.current.selectedSpecification !== currentFilters.selectedSpecification ||
      prevFiltersRef.current.selectedCategories.join(",") !== currentFilters.selectedCategories.join(",") ||
      prevFiltersRef.current.selectedAccords.join(",") !== currentFilters.selectedAccords.join(",") ||
      prevFiltersRef.current.selectedPerfumeNotes.join(",") !== currentFilters.selectedPerfumeNotes.join(",") ||
      prevFiltersRef.current.selectedPerformance.join(",") !== currentFilters.selectedPerformance.join(",") ||
      prevFiltersRef.current.selectedProjection.join(",") !== currentFilters.selectedProjection.join(",");

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
    selectedProjection,
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
      selectedProjection: [],
    };

    setPriceRange(resetFilters.priceRange);
    setSelectedCategories(resetFilters.selectedCategories);
    setSelectedSpecification(resetFilters.selectedSpecification);
    setSelectedAccords(resetFilters.selectedAccords);
    setSelectedPerfumeNotes(resetFilters.selectedPerfumeNotes);
    setSelectedPerformance(resetFilters.selectedPerformance);
    setSelectedProjection(resetFilters.selectedProjection);

    onApplyFilters(resetFilters);
  };

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
      { value: "BEAST_MODE", label: "Ultra (12hrs+)" },
      { value: "EXCELLENT", label: "Excellent (8-10hrs)" },
      { value: "GOOD", label: "Good (5-6hrs)" },
      { value: "MODERATE", label: "Moderate (3-4hrs)" },
    ],
    projection: [
      { value: "NUCLEAR", label: "Nuclear (10+ feet)" },
      { value: "STRONG", label: "Strong (7-9 feet)" },
      { value: "MODERATE", label: "Moderate (4-6 feet)" },
      { value: "INTIMATE", label: "Intimate (1-2 feet)" },
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
              </CollapsibleContent>
            </Collapsible>

            <Separator />

            <Collapsible defaultOpen>
              <CollapsibleContent>
                {Object.entries(smellTypes).map(([groupName, items]) => {
                  const isSingleSelect = groupName === "performance" || groupName === "projection";
                  const isLongList = items.length > 12;

                  const selected =
                    groupName === "smellAccords"
                      ? selectedAccords
                      : groupName === "perfumeNotes"
                        ? selectedPerfumeNotes
                        : groupName === "performance"
                          ? selectedPerformance
                          : selectedProjection;

                  const setSelected =
                    groupName === "smellAccords"
                      ? setSelectedAccords
                      : groupName === "perfumeNotes"
                        ? setSelectedPerfumeNotes
                        : groupName === "performance"
                          ? setSelectedPerformance
                          : setSelectedProjection;

                  return (
                    <div key={groupName} className="mb-6">
                      <h5 className="text-md font-semibold text-gray-800 mb-0 capitalize">
                        {groupName.replace(/([A-Z])/g, " $1")}
                      </h5>
                      <div className="h-1 w-64 lg:w-72 mb-4 rounded-full bg-gradient-to-r from-pink-500 via-pink-600 to-purple-600" />

                      <div
                        className={cn(
                          "grid grid-cols-1 sm:grid-cols-2 gap-2",
                          (groupName === "performance" || groupName === "projection") && "grid-cols-1 sm:grid-cols-1",
                          isLongList && "max-h-56 overflow-y-auto pr-1"
                        )}
                      >
                        {items.map((item) => {
                          const id = `${groupName}-${item.value}`;
                          const checked = selected.includes(item.value);

                          return (
                            <Label
                              key={item.value}
                              htmlFor={id}
                              className={cn(
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
                                  if (isSingleSelect) {
                                    setSelected(isChecked ? [item.value] : []);
                                  } else {
                                    setSelected((prev) =>
                                      isChecked ? [...prev, item.value] : prev.filter((s) => s !== item.value)
                                    );
                                  }
                                }}
                              />

                              <span className="text-sm font-medium text-gray-700 flex-1">
                                {item.label}
                              </span>
                            </Label>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </CollapsibleContent>
            </Collapsible>

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
                    <SelectItem value="unisex">Unisex</SelectItem>
                    <SelectItem value="male">Men</SelectItem>
                    <SelectItem value="female">Women</SelectItem>
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