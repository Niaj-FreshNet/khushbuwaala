"use client";

import { useEffect, useRef } from "react";
import { kwCategoryName } from "@/lib/Analytics/kwEcom";
import { kwDataLayerPush } from "@/lib/Analytics/dataLayerGate";
import { useProductSelection } from "@/context/ProductSelectionContext";
import type { IProduct, IProductVariant } from "@/types/product.types";

function formatVariantLabel(v: IProductVariant) {
  if (v?.size != null && v?.unit) return `${v.size}${v.unit}`;
  if (v?.sku) return v.sku;
  if (v?.id) return v.id;
  return undefined;
}

export default function TrackVariantChange({
  product,
}: {
  product: IProduct;
}) {
  const { selectedVariant } = useProductSelection();
  const prevVariantIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!product?.slug || !selectedVariant?.id) return;

    // don't fire on first default set (page load)
    if (prevVariantIdRef.current === null) {
      prevVariantIdRef.current = selectedVariant.id;
      return;
    }

    // fire only when variant actually changes
    if (prevVariantIdRef.current === selectedVariant.id) return;
    prevVariantIdRef.current = selectedVariant.id;

    const price = selectedVariant.price ?? product.minPrice ?? undefined;
    const currency = "BDT";
    const itemVariant = formatVariantLabel(selectedVariant);

    const itemId = String(product.id || product.slug);
    const variantId = String(selectedVariant.id);

    const category = kwCategoryName(product);

    // Sent through the shop's gate, so an event made before Tag Manager has started is not lost.
    kwDataLayerPush({ ecommerce: null });

    kwDataLayerPush({
      event: "select_item",
      ecommerce: {
        currency,
        value: price,
        item_list_name: "Product Detail Variant",
        items: [
          {
            item_id: itemId,
            item_name: product.name,
            item_brand: product.brand || "Khushbuwaala",
            item_category: category || "Shop",
            item_variant: itemVariant,
            price,
            quantity: 1,
          },
        ],
      },
    });

    // Meta: its own event name, which the Meta tag in Tag Manager listens for
    kwDataLayerPush({
      event: "fb_select_variant",

      // Meta-friendly params
      content_name: product.name,
      content_type: "product",
      content_ids: [itemId], // or use variantId if your Meta catalog uses variant IDs
      currency,
      value: price,

      // Recommended "contents" structure for Meta
      contents: [
        {
          id: itemId, // or variantId (see note below)
          quantity: 1,
          item_price: price,
        },
      ],

      // extra helpful fields (optional)
      variant_id: variantId,
      item_variant: itemVariant,
      sku: selectedVariant.sku,
      category: category,
    });
  }, [selectedVariant, product]);

  return null;
}
