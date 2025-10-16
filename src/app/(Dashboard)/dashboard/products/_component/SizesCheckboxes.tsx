import { VariantForForm } from "@/types/product.types";
import { useFormContext } from "react-hook-form";
import { v4 as uuidv4 } from 'uuid';

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

export default function SizesCheckboxes({ selectedSizes }: { selectedSizes: string[] }) {
    const form = useFormContext<FormValues>();

    return (
        <div className="flex flex-wrap gap-3 mt-1">
            {selectedSizes.map((size) => (
              <label key={size} className="flex items-center gap-1 text-sm text-gray-900 font-bold">
                    <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-900 accent-[#FB923C] "
                        checked={form.getValues('variants').some((v) => v.size === size)}
                        onChange={(e) => {
                            const variants = form.getValues('variants');
                            if (e.target.checked) {
                                form.setValue('variants', [
                                    ...variants,
                                    { id: uuidv4(), size: size, price: 0, stock: 0, sku: '', unit: 'ML' },
                                ]);
                            } else {
                                form.setValue('variants', variants.filter((v) => v.size !== size));
                            }
                        }}
                    />
                    <span className="text-sm text-gray-900">{size}</span>
                </label>
            ))}
        </div>
    );
}
