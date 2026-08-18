// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Button } from "@/components/ui/Button";

describe("Button", () => {
  it("renders an anchor with the primary pill classes when href is set", () => {
    const { container } = render(<Button href="/book-a-call">Book a call</Button>);
    const a = container.querySelector("a")!;
    expect(a.getAttribute("href")).toBe("/book-a-call");
    expect(a.className).toContain("rounded-full");
    expect(a.className).toContain("bg-black");
    expect(a.className).toContain("text-white");
  });
  it("renders a button element when no href", () => {
    const { container } = render(<Button>Go</Button>);
    expect(container.querySelector("button")).toBeTruthy();
  });
  it("light variant uses the cta-ink token", () => {
    const { container } = render(<Button href="/x" variant="light">B</Button>);
    expect(container.querySelector("a")!.className).toContain("text-cta-ink");
  });
});
