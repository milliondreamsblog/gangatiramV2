// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { SectionHeader, splitTitle } from "@/components/ui/SectionHeader";

describe("splitTitle", () => {
  it("splits on the delimiter, keeping it on the remainder", () => {
    expect(splitTitle("10 Best Agencies for YC Startups", " for ")).toEqual({
      lead: "10 Best Agencies",
      rest: "for YC Startups",
    });
  });
  it("returns whole title as lead + empty rest when delimiter absent", () => {
    expect(splitTitle("Design Systems", " for ")).toEqual({
      lead: "Design Systems",
      rest: "",
    });
  });
});

describe("SectionHeader", () => {
  it("mutes the lead only when there is a remainder", () => {
    const { container } = render(<SectionHeader title="A for B" />);
    const spans = container.querySelectorAll("h1 span");
    expect(spans[0].className).toContain("text-black/60");
  });
  it("renders the whole title in full black when no split", () => {
    const { container } = render(<SectionHeader title="Design Systems" />);
    const lead = container.querySelector("h1 span")!;
    expect(lead.className).toContain("text-black");
    expect(lead.className).not.toContain("text-black/60");
  });
});
