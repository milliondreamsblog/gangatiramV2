// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ArticleLayout } from "@/components/shared/ArticleLayout";

// jsdom (as configured in this repo) does not implement IntersectionObserver.
// ArticleLayout renders Toc, which uses it purely to track scroll-based
// "active" highlighting, which these tests don't assert on, so a no-op stub
// is sufficient to let the component render.
class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
// @ts-expect-error -- minimal stub, not a full IntersectionObserver implementation
global.IntersectionObserver = IntersectionObserverStub;

describe("ArticleLayout", () => {
  const base = {
    pills: ["Tag A", "Jun 2026"],
    title: "Best agencies for YC startups",
    toc: [{ text: "Intro", id: "intro" }],
    sidebar: <aside data-testid="sidebar">side</aside>,
  };

  it("renders pill chips, the center children, and the sidebar", () => {
    const { container, getByText, getByTestId } = render(
      <ArticleLayout {...base}><div data-testid="body">body</div></ArticleLayout>,
    );
    expect(getByText("Tag A")).toBeTruthy();
    expect(getByText("Jun 2026")).toBeTruthy();
    expect(getByTestId("body")).toBeTruthy();
    expect(getByTestId("sidebar")).toBeTruthy();
    expect(container.querySelector("article")).toBeTruthy();
    expect(container.querySelector("header")).toBeTruthy();
  });

  it("splits the title on ' for ': grey lead, black remainder", () => {
    const { container } = render(
      <ArticleLayout {...base}><div /></ArticleLayout>,
    );
    const h1 = container.querySelector("h1")!;
    const spans = h1.querySelectorAll("span");
    expect(spans.length).toBe(2);
    expect(spans[0].textContent).toBe("Best agencies");
    expect(spans[0].className).toContain("text-black/60");
    expect(spans[1].textContent).toBe("for YC startups");
  });

  it("with no ' for ' in the title, renders a single black lead span", () => {
    const { container } = render(
      <ArticleLayout {...base} title="A plain title"><div /></ArticleLayout>,
    );
    const spans = container.querySelector("h1")!.querySelectorAll("span");
    expect(spans.length).toBe(1);
    expect(spans[0].textContent).toBe("A plain title");
    expect(spans[0].className).toContain("text-black");
    expect(spans[0].className).not.toContain("text-black/60");
  });

  it("renders excerpt only when provided", () => {
    const { queryByText, rerender, getByText } = render(
      <ArticleLayout {...base}><div /></ArticleLayout>,
    );
    expect(queryByText("My excerpt")).toBeNull();
    rerender(
      <ArticleLayout {...base} excerpt="My excerpt"><div /></ArticleLayout>,
    );
    expect(getByText("My excerpt")).toBeTruthy();
  });

  it("renders related content when provided", () => {
    const { getByTestId } = render(
      <ArticleLayout {...base} related={<div data-testid="related" />}><div /></ArticleLayout>,
    );
    expect(getByTestId("related")).toBeTruthy();
  });
});
