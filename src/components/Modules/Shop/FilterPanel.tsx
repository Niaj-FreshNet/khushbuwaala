"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FacetGroup, FacetOption, Facets, ShopState } from "@/lib/discovery";
import { formatTaka } from "@/lib/discovery";

type Section = {
  group: FacetGroup;
  title: string;
  /** One plain sentence for customers who do not know perfume terms */
  help?: string;
  /** Options shown before "Show all" */
  preview?: number;
  /** Start collapsed on phones to keep the sheet short */
  collapsed?: boolean;
};

const SECTIONS: Section[] = [
  { group: "families", title: "How should it smell?", help: "Pick one or more. We show perfumes that match all of them.", preview: 10 },
  { group: "notes", title: "A scent you love", help: "Ingredients you can actually smell in the perfume.", preview: 10 },
  { group: "longevity", title: "How long it lasts" },
  { group: "projection", title: "How far it reaches", help: "Soft stays close to you; strong gets noticed across a room." },
  { group: "occasions", title: "Where you will wear it", collapsed: true },
  { group: "gender", title: "Who it is for", collapsed: true },
  { group: "times", title: "Day or evening", collapsed: true },
  { group: "seasons", title: "Weather", collapsed: true },
  { group: "category", title: "Collection", collapsed: true },
];

const BUDGETS = [300, 500, 1000, 2000];

function Chip({ option, onToggle, showHint }: { option: FacetOption; onToggle: () => void; showHint?: boolean }) {
  const disabled = option.count === 0 && !option.selected;
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      aria-pressed={option.selected}
      title={option.hint}
      className={cn(
        "min-h-0! inline-flex items-center gap-1.5 rounded-full border px-3 text-left text-[13px] leading-tight transition-colors",
        showHint && option.hint ? "py-1.5" : "h-9",
        option.selected
          ? "border-emerald-700 bg-emerald-700 text-white"
          : "border-stone-200 bg-white text-stone-800 hover:border-emerald-600",
        disabled && "cursor-not-allowed opacity-40 hover:border-stone-200"
      )}
    >
      <span>
        <span className="font-medium">{option.label}</span>
        {showHint && option.hint && (
          <span className={cn("block text-[11px] font-normal", option.selected ? "text-emerald-50" : "text-stone-500")}>
            {option.hint}
          </span>
        )}
      </span>
      <span className={cn("text-[11px] tabular-nums", option.selected ? "text-emerald-100" : "text-stone-400")}>
        {option.count}
      </span>
    </button>
  );
}

function FacetSection({
  section,
  options,
  onToggle,
}: {
  section: Section;
  options: FacetOption[];
  onToggle: (id: string) => void;
}) {
  const anySelected = options.some((o) => o.selected);
  const [open, setOpen] = useState(!section.collapsed || anySelected);
  const [showAll, setShowAll] = useState(false);

  if (!options.length) return null;
  const preview = section.preview ?? options.length;
  // selected options are never hidden behind "Show all"
  const visible = showAll ? options : options.filter((o, i) => i < preview || o.selected);
  const hidden = options.length - visible.length;

  return (
    <section className="border-b border-stone-100 py-3 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="min-h-0! flex w-full items-center justify-between gap-2 py-1 text-left"
      >
        <span className="text-sm font-semibold text-stone-900">{section.title}</span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-stone-500 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="pt-1.5">
          {section.help && <p className="mb-2 text-xs text-stone-500">{section.help}</p>}
          <div className="flex flex-wrap gap-1.5">
            {visible.map((option) => (
              <Chip
                key={option.id}
                option={option}
                onToggle={() => onToggle(option.id)}
                showHint={section.group === "longevity" || section.group === "projection"}
              />
            ))}
          </div>
          {(hidden > 0 || showAll) && options.length > preview && (
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              className="min-h-0! mt-2 text-xs font-semibold text-emerald-800 underline underline-offset-2"
            >
              {showAll ? "Show fewer" : `Show all ${options.length}`}
            </button>
          )}
        </div>
      )}
    </section>
  );
}

export function FilterPanel({
  facets,
  state,
  lockedGroups = [],
  onToggle,
  onChange,
}: {
  facets: Facets;
  state: ShopState;
  lockedGroups?: FacetGroup[];
  onToggle: (group: FacetGroup, id: string) => void;
  onChange: (patch: Partial<ShopState>) => void;
}) {
  return (
    <div>
      {SECTIONS.filter((s) => !lockedGroups.includes(s.group)).map((section) => (
        <FacetSection
          key={section.group}
          section={section}
          options={facets[section.group] ?? []}
          onToggle={(id) => onToggle(section.group, id)}
        />
      ))}

      <section className="border-b border-stone-100 py-3">
        <h3 className="py-1 text-sm font-semibold text-stone-900">Budget</h3>
        <p className="mb-2 text-xs text-stone-500">
          We show perfumes that have at least one size within your budget.
        </p>
        <div className="flex flex-wrap gap-1.5">
          {BUDGETS.map((max) => {
            const selected = state.maxPrice === max && state.minPrice === undefined;
            return (
              <button
                key={max}
                type="button"
                aria-pressed={selected}
                onClick={() => onChange({ minPrice: undefined, maxPrice: selected ? undefined : max })}
                className={cn(
                  "min-h-0! h-9 rounded-full border px-3 text-[13px] font-medium transition-colors",
                  selected ? "border-emerald-700 bg-emerald-700 text-white" : "border-stone-200 bg-white text-stone-800 hover:border-emerald-600"
                )}
              >
                Under {formatTaka(max)}
              </button>
            );
          })}
        </div>
      </section>

      <section className="py-3">
        <h3 className="py-1 text-sm font-semibold text-stone-900">Availability</h3>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            aria-pressed={state.inStock}
            onClick={() => onChange({ inStock: !state.inStock })}
            className={cn(
              "min-h-0! h-9 rounded-full border px-3 text-[13px] font-medium transition-colors",
              state.inStock ? "border-emerald-700 bg-emerald-700 text-white" : "border-stone-200 bg-white text-stone-800 hover:border-emerald-600"
            )}
          >
            In stock only
          </button>
          {(facets.onSale > 0 || state.onSale) && (
            <button
              type="button"
              aria-pressed={state.onSale}
              onClick={() => onChange({ onSale: !state.onSale })}
              className={cn(
                "min-h-0! h-9 rounded-full border px-3 text-[13px] font-medium transition-colors",
                state.onSale ? "border-emerald-700 bg-emerald-700 text-white" : "border-stone-200 bg-white text-stone-800 hover:border-emerald-600"
              )}
            >
              On offer <span className="text-[11px] opacity-70">{facets.onSale}</span>
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
