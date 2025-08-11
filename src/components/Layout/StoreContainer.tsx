import { ReactNode } from "react";

export default function StoreContainer({ children }: { children: ReactNode }) {
    return (
        <div className="max-w-screen-2xl mx-auto pt-20">
            {children}
        </div>
    )
}