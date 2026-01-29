"use client";

import React, { createContext, useContext, useState } from "react";

type ActionState = {
    isAddingToCart: boolean;
    isBuyingNow: boolean;
    startAdd: () => void;
    endAdd: () => void;
    startBuy: () => void;
    endBuy: () => void;
};

const ProductActionContext = createContext<ActionState | null>(null);

export function ProductActionProvider({ children }: { children: React.ReactNode }) {
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [isBuyingNow, setIsBuyingNow] = useState(false);

    return (
        <ProductActionContext.Provider
            value={{
                isAddingToCart,
                isBuyingNow,
                startAdd: () => setIsAddingToCart(true),
                endAdd: () => setIsAddingToCart(false),
                startBuy: () => setIsBuyingNow(true),
                endBuy: () => setIsBuyingNow(false),
            }}
        >
            {children}
        </ProductActionContext.Provider>
    );
}

export function useProductAction() {
    const ctx = useContext(ProductActionContext);
    if (!ctx) throw new Error("useProductAction must be used inside ProductActionProvider");
    return ctx;
}
