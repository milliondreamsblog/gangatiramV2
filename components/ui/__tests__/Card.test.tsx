// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Card } from "@/components/ui/Card";

describe("Card", () => {
  it("uses rounded-lg + line border token + white bg", () => {
    const { container } = render(<Card>x</Card>);
    const c = container.firstElementChild!.className;
    expect(c).toContain("rounded-lg");
    expect(c).toContain("border-line");
    expect(c).toContain("bg-white");
  });
});
