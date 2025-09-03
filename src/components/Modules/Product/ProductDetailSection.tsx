import { IProduct } from "@/types/product.types";
import ProductDetails from "./ProductDetails";

interface IProductDetailSectionProps {
    product: Partial<IProduct>;
}

export default function ProductDetailSection({ product }: IProductDetailSectionProps) {
    return (
        <ProductDetails
            product={{
                ...product,
                description: product.description || `Premium ${product.gender === 'male' ? "men's" : "women's"} perfume from KhushbuWaala`
            }}
            onReadMore={() => {
                document.getElementById('product-accordion')?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                setTimeout(() => {
                    const descriptionButton = document.querySelector('[data-section="description"]') as HTMLButtonElement;
                    if (descriptionButton) descriptionButton.click();
                }, 500);
            }}
        />
    );
}
