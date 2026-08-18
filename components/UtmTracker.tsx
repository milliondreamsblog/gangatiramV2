"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/utm";

/** Captures UTM/click attribution on load; renders nothing. */
export function UtmTracker() {
  useEffect(() => {
    captureAttribution();
  }, []);
  return null;
}
