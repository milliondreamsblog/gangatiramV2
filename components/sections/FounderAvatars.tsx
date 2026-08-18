"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

const FOUNDERS = [
  {
    name: "Siddharth",
    role: "Co-Founder & Design Lead",
    avatar: "/team/avatars/avatar-1.png",
  },
  {
    name: "Divij",
    role: "Co-Founder & CMO",
    avatar: "/team/avatars/avatar-2.png",
  },
] as const;

export function FounderAvatars() {
  return (
    <div className="flex items-center">
      {FOUNDERS.map((f, i) => (
        <div
          key={f.name}
          className={cn("group relative hover:z-20", i > 0 && "-ml-3.5")}
        >
          {/* Avatar + always-on online dot */}
          <div className="relative size-11 origin-bottom transition-transform duration-200 ease-out group-hover:scale-105">
            <Image
              src={f.avatar}
              alt={f.name}
              width={44}
              height={44}
              className="size-full rounded-full border-[2.5px] border-white object-cover"
            />
            <span
              aria-hidden
              className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-white bg-success"
            />
          </div>

          {/* Hover card — dark glassmorphic */}
          <div className="pointer-events-none absolute right-0 top-full z-30 mt-2 w-max origin-top-right translate-y-1 scale-95 rounded-lg border border-white/15 bg-black/60 px-3 py-2 opacity-0 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.35)] backdrop-blur-md transition-all duration-200 ease-out group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100">
            <p className="text-sm font-medium leading-tight text-white">{f.name}</p>
            <p className="mt-0.5 text-xs leading-tight text-white/60">{f.role}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
