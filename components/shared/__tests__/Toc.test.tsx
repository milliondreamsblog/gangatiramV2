// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Toc } from "@/components/shared/Toc";

// jsdom (as configured in this repo) does not implement IntersectionObserver.
// Toc uses it purely to track scroll-based "active" highlighting, which these
// tests don't assert on, so a no-op stub is sufficient to let the component render.
class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
// @ts-expect-error -- minimal stub, not a full IntersectionObserver implementation
global.IntersectionObserver = IntersectionObserverStub;

describe("Toc", () => {
  it("renders nothing when items is empty", () => {
    const { container } = render(<Toc items={[]} />);
    expect(container.querySelector("nav")).toBeNull();
  });
  it("renders a labelled nav with one anchor per item, href=#id", () => {
    const items = [
      { text: "Intro", id: "intro" },
      { text: "Details", id: "details" },
    ];
    const { container, getByText } = render(<Toc items={items} />);
    const nav = container.querySelector("nav")!;
    expect(nav).toBeTruthy();
    expect(nav.textContent).toContain("Table of Content");
    const links = container.querySelectorAll("a");
    expect(links.length).toBe(2);
    expect((getByText("Intro") as HTMLAnchorElement).getAttribute("href")).toBe("#intro");
    expect((getByText("Details") as HTMLAnchorElement).getAttribute("href")).toBe("#details");
  });
});
