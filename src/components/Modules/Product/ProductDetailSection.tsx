"use client";

import ProductDetails from "./ProductDetails";
import { Product } from "@/lib/Data/data";

export default function ProductDetailSection({ product }: { product: Product }) {
    return (
        <ProductDetails
            product={{
                ...product,
                description: product.description || `Premium ${product.specification === 'male' ? "men's" : "women's"} perfume from KhushbuWaala`
            }}
            onReadMore={() => {
                document.getElementById('product-accordion')?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                setTimeout(() => {
                    const descriptionButton = document.querySelector('[data-section="description"]') as HTMLButtonElement;
                    if (descriptionButton) {
                        descriptionButton.click();
                    }
                }, 500);
            }}
        />
    );
}