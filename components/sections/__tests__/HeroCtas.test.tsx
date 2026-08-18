// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { HeroCtas } from "@/components/sections/HeroCtas";

describe("HeroCtas", () => {
  it("renders both CTAs with the right hrefs and labels", () => {
    const { getByText } = render(<HeroCtas variant="light" />);
    const talk = getByText("Talk to Founder") as HTMLAnchorElement;
    const book = getByText("Book a call") as HTMLAnchorElement;
    expect(talk.tagName).toBe("A");
    expect(book.tagName).toBe("A");
    expect(talk.getAttribute("href")).toBeTruthy();
    expect(book.getAttribute("href")).toBeTruthy();
  });
  it("light variant uses text-base surface/black styles", () => {
    const { getByText } = render(<HeroCtas variant="light" />);
    expect(getByText("Talk to Founder").className).toContain("bg-surface");
    expect(getByText("Book a call").className).toContain("bg-black");
    expect(getByText("Talk to Founder").className).toContain("text-base");
  });
  it("photo variant uses text-sm black/white styles in a flex-wrap wrapper", () => {
    const { getByText, container } = render(<HeroCtas variant="photo" />);
    expect(getByText("Talk to Founder").className).toContain("bg-black");
    expect(getByText("Talk to Founder").className).toContain("text-sm");
    expect((container.firstElementChild as HTMLElement).className).toContain("flex-wrap");
  });
  it("home variant uses backdrop-blur styles", () => {
    const { getByText } = render(<HeroCtas variant="home" />);
    expect(getByText("Talk to Founder").className).toContain("bg-black/25");
    expect(getByText("Book a call").className).toContain("text-cta-ink");
  });
});
