"use client";

import { useEffect, useState } from "react";

export default function Deferred({
    children,
    delay = 800,
}: {
    children: React.ReactNode;
    delay?: number;
}) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const id = window.setTimeout(() => setShow(true), delay);
        return () => window.clearTimeout(id);
    }, [delay]);

    return show ? <>{children}</> : null;
}
