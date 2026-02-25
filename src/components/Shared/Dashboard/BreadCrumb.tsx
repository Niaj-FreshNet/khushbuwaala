'use client'; // Client component for hooks

import React, { useEffect, useState } from "react";
import { LuChevronRight } from "react-icons/lu";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const BreadCrumb: React.FC = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [breadcrumbs, setBreadcrumbs] = useState<string[]>([]);

    // Split the current path into an array, filtering out empty values
    const pathnames = pathname.split("/").filter((x) => x);

    // Dynamically update breadcrumbs based on "tab" search parameter
    useEffect(() => {
        const tabPath = searchParams.get("tab")?.split("/") || [];
        setBreadcrumbs(tabPath);
    }, [searchParams]);

    return (
        <div className="hidden sm:block">
            <div className="flex flex-wrap items-center gap-2 font-semibold text-xs sm:text-sm md:text-base">
                {/* Render path-based breadcrumbs */}
                {pathnames?.map((breadcrumb, index) => {
                    const path = `/${pathnames.slice(0, index + 1).join("/")}`;
                    return (
                        <Link
                            href={path}
                            key={`path-${index}`}
                            className="capitalize flex items-center gap-2 text-balance text-[15px] font-sans font-stretch-condensed text-primary"
                        >
                            {breadcrumb}
                            {index < pathnames.length - 1 && (
                                <LuChevronRight className="min-h-5 min-w-5" />
                            )}
                        </Link>
                    );
                })}
                {/* Render tab-based breadcrumbs */}
                {breadcrumbs?.map((breadcrumb, index) => (
                    <span
                        key={`tab-${index}`}
                        className="capitalize flex items-center text-balance text-[15px] font-sans font-stretch-condensed text-primary"
                    >
                        {index === 0 && <LuChevronRight className="min-h-5 min-w-5" />}
                        {breadcrumb}
                        {index < breadcrumbs.length - 1 && (
                            <LuChevronRight className="min-h-5 min-w-5" />
                        )}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default BreadCrumb;