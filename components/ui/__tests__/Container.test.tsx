// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Container } from "@/components/ui/Container";

describe("Container", () => {
  it("applies the page max-width and standard gutters by default", async () => {
    const { container } = render(<Container>x</Container>);
    const el = container.firstElementChild!;
    expect(el.className).toContain("max-w-[1800px]");
    expect(el.className).toContain("mx-auto");
    expect(el.className).toContain("px-5");
    expect(el.className).toContain("md:px-10");
  });
  it("maps size prop to the right max-width", () => {
    const { container } = render(<Container size="prose">x</Container>);
    expect(container.firstElementChild!.className).toContain("max-w-[720px]");
  });
  it("padded (default) includes px-5 md:px-10", () => {
    const { container } = render(<Container>x</Container>);
    const el = container.firstElementChild as HTMLElement;
    expect(el.className).toContain("px-5");
    expect(el.className).toContain("md:px-10");
  });
  it("padded={false} omits horizontal padding but keeps the page container", () => {
    const { container } = render(<Container padded={false}>x</Container>);
    const el = container.firstElementChild as HTMLElement;
    expect(el.className).not.toContain("px-5");
    expect(el.className).not.toContain("md:px-10");
    expect(el.className).toContain("max-w-[1800px]");
  });
  it("passes through className extras", () => {
    const { container } = render(
      <Container padded={false} className="flex gap-4">x</Container>,
    );
    const el = container.firstElementChild as HTMLElement;
    expect(el.className).toContain("flex");
    expect(el.className).toContain("gap-4");
  });
});
