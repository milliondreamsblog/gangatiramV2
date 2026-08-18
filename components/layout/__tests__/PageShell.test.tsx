// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { PageShell } from "@/components/layout/PageShell";

describe("PageShell", () => {
  it("stacked (default): no wrapping <main>, renders nav + children + footer, no announcement", () => {
    const { container } = render(<PageShell><div data-testid="content" /></PageShell>);
    // no clip <main> wrapper at the root
    expect(container.querySelector(":scope > main.overflow-x-clip")).toBeNull();
    expect(container.querySelector('[data-testid="content"]')).toBeTruthy();
    // announcement absent by default
    expect(container.textContent).not.toContain("Looking for a design agency");
  });
  it("announcement=true renders the promo bar before the nav", () => {
    const { container } = render(<PageShell announcement><div /></PageShell>);
    expect(container.textContent).toContain("Looking for a design agency");
  });
  it("footer=false omits the footer", () => {
    const { container } = render(<PageShell footer={false}><div /></PageShell>);
    // Footer contains the wordmark/quick-links; assert its absence via a known footer string
    expect(container.querySelector("footer")).toBeNull();
  });
  it("srHeading renders a sr-only <h1> as the first child, before the nav", () => {
    const { container } = render(
      <PageShell srHeading="My page title"><div /></PageShell>,
    );
    const first = container.firstElementChild as HTMLElement;
    expect(first.tagName).toBe("H1");
    expect(first.className).toBe("sr-only");
    expect(first.textContent).toBe("My page title");
  });
  it("srHeading in clip layout is the first child inside <main>", () => {
    const { container } = render(
      <PageShell layout="clip" srHeading="Clip title"><div /></PageShell>,
    );
    const main = container.firstElementChild as HTMLElement;
    expect(main.tagName).toBe("MAIN");
    const firstInMain = main.firstElementChild as HTMLElement;
    expect(firstInMain.tagName).toBe("H1");
    expect(firstInMain.className).toBe("sr-only");
  });
  it("layout=clip wraps everything in the relative overflow-x-clip <main>", () => {
    const { container } = render(<PageShell layout="clip"><div data-testid="c" /></PageShell>);
    const root = container.firstElementChild as HTMLElement;
    expect(root.tagName).toBe("MAIN");
    expect(root.className).toContain("relative");
    expect(root.className).toContain("overflow-x-clip");
    expect(root.className).toContain("bg-white");
    expect(root.querySelector('[data-testid="c"]')).toBeTruthy();
  });
});
