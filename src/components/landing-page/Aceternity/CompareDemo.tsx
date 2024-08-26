import React from "react";
import { Compare } from "@/components/ui/compare";

export function CompareDemo() {
  return (
    <div className="w-full h-screen">  {/* Set height to full screen */}
      <Compare
        firstImage="/comparelegions3.png"
        secondImage="/comparelegions2.png"
        firstImageClassName="object-cover object-left-top w-full h-full"
        secondImageClassname="object-cover object-left-top w-full h-full"
        className="w-full h-full"
        slideMode="hover"
      />
    </div>
  );
}
