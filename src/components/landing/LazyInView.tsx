"use client";

import type { ReactNode } from "react";
import { useInView } from "@/hooks/useInView";

type LazyInViewProps = {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
  minHeight?: number | string;
  className?: string;
};

export function LazyInView({
  children,
  fallback = null,
  rootMargin = "240px 0px",
  minHeight,
  className,
}: LazyInViewProps) {
  const { ref, inView } = useInView({ rootMargin, once: true });

  return (
    <div
      ref={ref}
      className={className}
      style={!inView && minHeight !== undefined ? { minHeight } : undefined}
    >
      {inView ? children : fallback}
    </div>
  );
}
