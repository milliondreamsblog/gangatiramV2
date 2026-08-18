"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function Toc({ items }: { items: { text: string; id: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-15% 0px -75% 0px" },
    );
    items.forEach((i) => {
      const el = document.getElementById(i.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav className="flex flex-col gap-3 rounded-lg border border-[#dcdde0] p-5">
      <p className="mb-1 text-xs font-medium tracking-[-0.01em] text-black/40">
        Table of Content
      </p>
      {items.map((i) => (
        <a
          key={i.id}
          href={`#${i.id}`}
          className={cn(
            "text-sm leading-snug tracking-[-0.01em] transition-colors",
            active === i.id ? "font-medium text-black" : "text-black/50 hover:text-black",
          )}
        >
          {i.text}
        </a>
      ))}
    </nav>
  );
}
