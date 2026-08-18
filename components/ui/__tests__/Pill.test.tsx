// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Pill } from "@/components/ui/Pill";

describe("Pill", () => {
  it("chip variant reproduces the label-chip classes + surface token", () => {
    const { container } = render(<Pill>Website Design</Pill>);
    const c = container.firstElementChild!.className;
    expect(c).toContain("h-7");
    expect(c).toContain("rounded-full");
    expect(c).toContain("bg-surface");
    expect(c).toContain("px-3");
  });
  it("tab variant uses rounded-lg + h-10", () => {
    const { container } = render(<Pill variant="tab">All</Pill>);
    const c = container.firstElementChild!.className;
    expect(c).toContain("h-10");
    expect(c).toContain("rounded-lg");
  });
});
