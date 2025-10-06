import FormInput from "@/components/ReusableUI/FormInput";
import { Button } from "@/components/ui/button";
import { IProductVariant } from "@/types/product.types";
import { X } from "lucide-react";
import { useFormContext } from "react-hook-form";

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
    variants: IProductVariant[];
    images: File[];
}

// Variants section uses useFormContext internally
// export const VariantsSection = ({ selectedSizes, colorPickersVisible, toggleColorPicker, handleColorChange }) => {
export const VariantsSection = ({ selectedSizes }: Props) => {
    const form = useFormContext<FormValues>();
    console.log('varinat', form.watch('variants'))
    console.log('selectedsiZes', selectedSizes)

    return (
        <div>
            {form.watch('variants').map((variant, index) => (
                <div key={index} className="border border-[#FB923C] rounded-lg p-4 mb-4">
                    <div className="flex justify-end mb-2">
                        <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => {
                                const variants = form.getValues('variants');
                                form.setValue('variants', variants.filter((_, i) => i !== index));
                            }}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormInput
                            name={`variants.${index}.size`}
                            label="Size"
                            type="select"
                            options={selectedSizes.map((size) => ({ value: size, label: size }))}
                            inputClassName="border-[#FB923C]"
                        />
                        {/* <div>
                            <label className="text-sm font-medium text-gray-700">Color</label>
                            <div className="flex items-center gap-2">
                                <Popover open={colorPickersVisible[index]} onOpenChange={() => toggleColorPicker(index)}>
                                    <PopoverTrigger asChild>
                                        <div
                                            className="w-6 h-6 border border-gray-300 cursor-pointer"
                                            style={{ backgroundColor: variant.color }}
                                        />
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <ChromePicker color={variant.color} onChangeComplete={(color) => handleColorChange(index, color)} />
                                    </PopoverContent>
                                </Popover>
                                <FormInput
                                    name={`variants.${index}.color`}
                                    label=""
                                    placeholder="Hex code"
                                    inputClassName="border-[#FB923C]"
                                />
                            </div>
                        </div> */}
                        <FormInput name={`variants.${index}.price`} label="Price" type="number" inputClassName="border-[#FB923C]" />
                        <FormInput name={`variants.${index}.stock`} label="Quantity" type="number" inputClassName="border-[#FB923C]" />
                        <FormInput name={`variants.${index}.sku`} label="SKU" inputClassName="border-[#FB923C]" />
                        <FormInput name={`variants.${index}.unit`} label="Unit" placeholder="ML" inputClassName="border-[#FB923C]" />
                    </div>
                </div>
            ))}
        </div>
    );
};