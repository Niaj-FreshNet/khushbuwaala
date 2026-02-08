"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
    return (
        <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="gap-2"
            type="button"
        >
            <ArrowLeft size={16} />
            Go Back
        </Button>
    );
}
