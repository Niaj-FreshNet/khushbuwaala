'use client'; // Mark as client component for hooks

import { useSelector } from "react-redux";
import type { Dispatch, SetStateAction } from "react";
import { LuMenu, LuX } from "react-icons/lu";
import { RootState } from "@/redux/store/store";

export default function TopBar({
    isOpen,
    setIsOpen,
    dark = false,
}: {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    dark?: boolean;
}) {
    // ⬅️ Get user from Redux store (adapt to Next.js context if needed for SSR)
    const user = useSelector((state: RootState) => state.auth.user) as { name?: string; role?: string } | null;

    return (
        <header className={`shadow-sm ${dark ? "bg-white" : "bg-white"}`}>
            <div className="flex items-center justify-between gap-3 px-3 sm:px-4 py-3">
                {/* Toggle Button */}
                <button
                    className={`lg:hidden p-2 rounded-md transition-colors ${dark ? "bg-black" : "hover:bg-gray-100"}`}
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    {isOpen ? (
                        <LuX className={`h-6 w-6 ${dark ? "text-white" : "text-gray-700"}`} />
                    ) : (
                        <LuMenu className={`h-6 w-6 ${dark ? "text-white" : "text-gray-700"}`} />
                    )}
                </button>

                {/* Welcome (truncate on small screens) */}
                <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium ${dark ? "text-black" : "text-gray-700"} truncate`}>
                        Welcome Back, {user?.name || "John Doe"}! <span className="ml-1">👋</span>
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                        {user?.role || "Super Admin"}
                    </div>
                </div>

                {/* User info - hide on xs to prevent overflow */}
                <div className="hidden sm:flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-gray-200" />
                    <div className="leading-tight">
                        <div className={`text-sm font-medium ${dark ? "text-black" : "text-gray-700"}`}>
                            {user?.name || "John Doe"}
                        </div>
                        <div className="text-xs text-gray-500">
                            {user?.role || "Super Admin"}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}