// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Section } from "@/components/ui/Section";

describe("Section", () => {
  it("renders a <section> with vertical padding wrapping a Container", () => {
    const { container } = render(<Section id="s">x</Section>);
    const s = container.querySelector("section#s")!;
    expect(s.className).toContain("py-12");
    expect(s.className).toContain("md:py-20");
    // container child carries the page max-width
    expect(s.querySelector('[class*="max-w-[1800px]"]')).toBeTruthy();
  });
});
