"use client";

import { useEffect, useState } from "react";

function formatTime(timeZone: string) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date());
}

/** Ticking HH:MM:SS clock for a given IANA time zone. */
export function LiveClock({ timeZone }: { timeZone: string }) {
  // Render nothing time-specific on the server to avoid hydration mismatch.
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setTime(formatTime(timeZone));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [timeZone]);

  return (
    <span suppressHydrationWarning>[ {time ?? "--:--:--"} ]</span>
  );
}
