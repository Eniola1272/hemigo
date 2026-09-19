"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PrintButton() {
  return (
    <Button tone="secondary" onClick={() => window.print()}>
      <Printer size={16} />
      Print
    </Button>
  );
}
