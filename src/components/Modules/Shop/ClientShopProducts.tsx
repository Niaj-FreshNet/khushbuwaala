"use client";

import dynamic from "next/dynamic";

const ShopProductsDynamic = dynamic(() => import("./ShopProducts").then(m => m.ShopProducts), {
  ssr: false
});

export function ClientShopProducts(props: any) {
  return <ShopProductsDynamic {...props} />;
}
