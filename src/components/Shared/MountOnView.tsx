"use client";

import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

export default function MountOnView({
    children,
    rootMargin = "300px",
}: {
    children: React.ReactNode;
    rootMargin?: string;
}) {
    const ref = useRef<HTMLDivElement | null>(null);
    const inView = useInView(ref, { margin: rootMargin as any, once: true });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        if (inView) setMounted(true);
    }, [inView]);

    return <div ref={ref}>{mounted ? children : null}</div>;
}
