"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface FilterSheetProps {
  visible: boolean;
  onClose: (open: boolean) => void;
  onApplyFilters: (filters: any) => void;
  initialFilters?: {
    category?: string;
  };
}

export function FilterSheet({
  visible,
  onClose,
  onApplyFilters,
  initialFilters,
}: FilterSheetProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([100, 5000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSmells, setSelectedSmells] = useState<string[]>([]);
  const [selectedSpecification, setSelectedSpecification] =
    useState<string>("all");

  useEffect(() => {
    if (initialFilters?.category) {
      setSelectedCategories([initialFilters.category]);
    }
  }, [initialFilters?.category]);

  const handleApply = () => {
    setTimeout(() => {
      onApplyFilters({
        priceRange,
        selectedCategories,
        selectedSmells,
        selectedSpecification,
      });
    }, 500); // simulate filter delay
  };

  useEffect(() => {
    handleApply();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceRange, selectedCategories, selectedSmells, selectedSpecification]);

  const handleCategoryChange = (value: string) => {
    setSelectedCategories(value === "all" ? [] : [value]);
  };

  const handleSmellChange = (smell: string, checked: boolean) => {
    setSelectedSmells((prev) =>
      checked ? [...prev, smell] : prev.filter((s) => s !== smell)
    );
  };

  const handleReset = () => {
    setSelectedCategories([]);
    setSelectedSmells([]);
    setSelectedSpecification("all");
    setPriceRange([100, 5000]);
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
                  value={selectedCategories[0] || "all"}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger className="w-full h-10 bg-white border-gray-200 rounded-md">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="inspiredPerfumeOil">
                      Inspired Perfume Oil
                    </SelectItem>
                    <SelectItem value="oriental">
                      Oriental & Arabian Attar
                    </SelectItem>
                    <SelectItem value="artificialOud">
                      Artificial Oud
                    </SelectItem>
                    <SelectItem value="natural">Natural Collections</SelectItem>
                    <SelectItem value="brand">Brand</SelectItem>
                  </SelectContent>
                </Select>
              </CollapsibleContent>
            </Collapsible>

            <Separator />

            <Collapsible defaultOpen>
              <CollapsibleContent>
                {Object.entries(smellTypes).map(([groupName, smells]) => (
                  <div key={groupName} className="mb-6">
                    <h5 className="text-md font-semibold text-gray-800 mb-0 capitalize">
                      {groupName.replace(/([A-Z])/g, " $1")}
                    </h5>
                    <div className="h-1 w-64 lg:w-72 mb-4 rounded-full bg-gradient-to-r from-pink-500 via-pink-600 to-purple-600" />
                    <div className="grid grid-cols-2 gap-2">
                      {smells.map((smell) => (
                        <div
                          key={smell}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`smell-${smell}`}
                            checked={selectedSmells.includes(smell)}
                            onCheckedChange={(checked) =>
                              handleSmellChange(smell, checked as boolean)
                            }
                          />
                          <Label
                            htmlFor={`smell-${smell}`}
                            className="text-sm text-gray-600 cursor-pointer"
                          >
                            {smell}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
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
                  onValueChange={(value: number[]) =>
                    setPriceRange(value as [number, number])
                  }
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
