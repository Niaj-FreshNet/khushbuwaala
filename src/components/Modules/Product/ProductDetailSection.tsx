// "use client";

// import { IProduct } from "@/types/product.types";
// import ProductDetails from "./ProductDetails";

// interface IProductDetailSectionProps {
//     product: Partial<IProduct>;
// }

// export default function ProductDetailSection({ product }: IProductDetailSectionProps) {
//     const onReadMore = () => {
//         document.getElementById("product-accordion")?.scrollIntoView({
//             behavior: "smooth",
//             block: "start",
//         });

//         setTimeout(() => {
//             const btn = document.querySelector(
//                 '[data-section="description"]'
//             ) as HTMLButtonElement | null;

//             btn?.click();
//         }, 500);
//     };

//     return (
//         <ProductDetails
//             product={{
//                 ...product,
//                 description:
//                     product.description ||
//                     `Premium ${product.gender === "male" ? "men's" : "women's"} perfume from KhushbuWaala`,
//             }}
//             onReadMore={onReadMore}
//         />
//     );
// }


import { IProduct } from "@/types/product.types";
import ProductDetailsShell from "./ProductDetailsShell.server";

interface Props {
    product: Partial<IProduct>;
}

export default function ProductDetailSection({ product }: Props) {
    return (
        <ProductDetailsShell
            product={{
                ...product,
                description:
                    product.description ||
                    `Premium ${product.gender === "male" ? "men's" : "women's"} perfume from KhushbuWaala`,
            }}
        />
    );
}
