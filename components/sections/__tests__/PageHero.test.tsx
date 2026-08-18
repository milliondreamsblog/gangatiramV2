// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { PageHero } from "@/components/sections/PageHero";

// jsdom lacks IntersectionObserver (Navbar / home variant may use it).
class IntersectionObserverStub {
  observe() {} unobserve() {} disconnect() {}
}
// @ts-expect-error -- minimal stub
global.IntersectionObserver = IntersectionObserverStub;

describe("PageHero", () => {
  it("light variant: white section, eyebrow + headline slots, subheadline, light CTAs", () => {
    const { container, getByText, getByTestId } = render(
      <PageHero
        variant="light"
        eyebrow={<span data-testid="eyebrow">EB</span>}
        headline={<span data-testid="headline">HL</span>}
        headlineClassName="max-w-[720px]"
        subheadline="Sub here"
      />,
    );
    const section = container.querySelector("section")!;
    expect(section.className).toContain("bg-white");
    expect(getByTestId("eyebrow")).toBeTruthy();
    expect(getByTestId("headline")).toBeTruthy();
    expect(getByText("Sub here")).toBeTruthy();
    expect(container.querySelector("h1")!.className).toContain("max-w-[720px]");
    expect(getByText("Talk to Founder").className).toContain("bg-surface");
  });
  it("light variant: no subheadline when omitted", () => {
    const { queryByText } = render(
      <PageHero variant="light" eyebrow={<span />} headline={<span />} />,
    );
    expect(queryByText(/./,{selector:"section p"})).toBeNull();
  });
  it("photo variant: black bg section, image, white headline, photo CTAs", () => {
    const { container, getByText } = render(
      <PageHero variant="photo" image="/x.png" eyebrow="EB" headline="Head line" />,
    );
    const section = container.querySelector("section")!;
    expect(section.className).toContain("bg-black");
    expect(getByText("Head line").className).toContain("text-white");
    expect(getByText("EB")).toBeTruthy();
    expect(getByText("Talk to Founder").className).toContain("text-sm");
  });
  it("home variant: min-h-svh section, embedded navbar, single-tone headline, home CTAs, clocks", () => {
    const { container } = render(<PageHero variant="home" />);
    const section = container.querySelector("section#top")!;
    expect(section.className).toContain("min-h-svh");
    // embedded nav (Navbar renders a <header> or <nav>)
    expect(container.querySelector("header, nav")).toBeTruthy();
    expect(container.textContent).toMatch(/Design Studio for/);
    expect(container.textContent).toMatch(/Fast-Growing SF Tech/);
    // The hero CTA pair (HeroCtas variant="home") is text-base + cta-ink book —
    // distinct from the nav's own text-sm "Book a call".
    const bookLinks = [...container.querySelectorAll('a[href="/book-a-call"]')];
    expect(
      bookLinks.some(
        (a) =>
          a.className.includes("text-base") &&
          a.className.includes("text-cta-ink"),
      ),
    ).toBe(true);
    // G2 rating pill present
    expect(container.textContent).toMatch(/G2/);
  });
});
