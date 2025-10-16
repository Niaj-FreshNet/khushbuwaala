'use client';

import { useEffect } from "react";
import FormInput from "@/components/ReusableUI/FormInput";
import { Button } from "@/components/ui/button";
import { VariantForForm } from "@/types/product.types";
import { X } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";

interface Props {
    selectedSizes: string[];
}

interface FormValues {
    name: string;
    description: string;
    brand: string;
    gender: string;
    perfumeNotes: { top: string; middle: string; base: string };
    accords: string;
    tags: string;
    categoryId: string;
    materialId: string;
    published: boolean;
    variants: VariantForForm[];
    images: File[];
}

export const VariantsSection = ({ selectedSizes }: Props) => {
    const form = useFormContext<FormValues>();
    const productName = useWatch({ control: form.control, name: "name" });
    const variants = form.watch("variants");

    // ✅ Keep your original auto-sync functionality when category or size selection changes
    // ✅ Sync sizes <-> variants
    useEffect(() => {
        const existingVariants = form.getValues("variants") || [];

        // Add new sizes
        const newVariants = selectedSizes
            .filter((size) => !existingVariants.some((v) => v.size === size))
            .map((size) => ({
                size,
                price: 111,
                unit: "ML", // ✅ Default unit
                sku: "",
            }));

        if (newVariants.length > 0) {
            form.setValue("variants", [...existingVariants, ...newVariants]);
        }

        // Remove unselected sizes
        const filtered = existingVariants.filter((v) =>
            selectedSizes.includes(v.size)
        );

        if (filtered.length !== existingVariants.length) {
            form.setValue("variants", filtered);
        }
    }, [selectedSizes]);

    // ✅ Auto-generate SKU dynamically with default fallbacks
    useEffect(() => {
        const updatedVariants = variants.map((variant) => {
            const namePart =
                productName?.trim().replace(/\s+/g, "").toUpperCase() || "PRODUCT";
            const sizePart = variant.size
                ? String(variant.size).toUpperCase()
                : "SIZE";
            const unitPart = variant.unit
                ? variant.unit.toUpperCase()
                : "ML"; // ✅ Default unit

            const skuWithDash = `KWP-${namePart}-${sizePart}-${unitPart}`;

            return {
                ...variant,
                price: variant.price, // ✅ Default price
                unit: variant.unit || "ML", // ✅ Default unit
                sku: skuWithDash,
            };
        });

        form.setValue("variants", updatedVariants, { shouldDirty: true });
    }, [
        productName,
        variants.map((v) => v.size).join(","),
        variants.map((v) => v.unit).join(","),
    ]);
    // console.log(variants);
    // const variant = variants.map(v => v.price);
    // console.log(variant)

    return (
        <div>
            {variants.map((variant, index) => (
                <div
                    key={index}
                    className="border border-[#FB923C] rounded-lg p-4 mb-4"
                >
                    <div className="flex justify-end mb-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                                const allVariants = form.getValues("variants");
                                form.setValue(
                                    "variants",
                                    allVariants.filter((_, i) => i !== index)
                                );
                            }}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* ✅ Size dropdown: shows "Size + Unit" */}
                        <FormInput
                            name={`variants.${index}.size`}
                            label="Size"
                            type="select"
                            options={selectedSizes.map((size) => ({
                                value: size,
                                label: `${size} ${variant.unit || "ML"}`,
                            }))}
                            inputClassName="border-[#FB923C]"
                            placeholder="Select Size"
                        />

                        {/* Price (editable) */}
                        <FormInput
                            name={`variants.${index}.price`}
                            label="Price"
                            type="number"
                            inputClassName="border-[#FB923C]"
                            value={variant.price} // show blank instead of 0
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                const value = e.target.value === "" ? 0 : parseFloat(e.target.value);
                                const allVariants = form.getValues("variants");
                                allVariants[index].price = value;
                                form.setValue("variants", allVariants, { shouldDirty: true });
                            }}
                        />

                        {/* Quantity (editable) */}
                        {/* <FormInput
                            name={`variants.${index}.stock`}
                            label="Quantity"
                            type="number"
                            inputClassName="border-[#FB923C]"
                        /> */}

                        {/* ✅ Unit field: visible but uneditable */}
                        <FormInput
                            name={`variants.${index}.unit`}
                            label="Unit"
                            placeholder="ML"
                            inputClassName="border-[#FB923C] bg-gray-50 text-gray-600 cursor-not-allowed"
                        />

                        {/* ✅ SKU field: read-only, auto-generated */}
                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                SKU
                            </label>
                            <input
                                value={variant.sku ? variant.sku.replace(/-/g, "") : ""}
                                readOnly
                                className="w-full border border-[#FB923C] rounded-md px-3 py-2 text-gray-600 bg-gray-50 cursor-not-allowed"
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
