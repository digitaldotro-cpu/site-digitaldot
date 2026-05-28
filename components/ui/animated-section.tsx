"use client";

import { cn } from "@/lib/utils";

type AnimatedSectionProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

export function AnimatedSection({
  children,
  className,
}: AnimatedSectionProps) {
  return (
    <div className={cn(className)}>
      {children}
    </div>
  );
}
