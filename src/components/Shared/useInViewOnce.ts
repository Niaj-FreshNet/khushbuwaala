"use client";

import { useEffect, useState } from "react";

export function useInViewOnce<T extends Element>(
    ref: React.RefObject<T | null>,
    options?: IntersectionObserverInit
) {
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el || inView) return;

        const obs = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setInView(true);
                obs.disconnect();
            }
        }, options);

        obs.observe(el);
        return () => obs.disconnect();
    }, [ref, inView, options]);

    return inView;
}
