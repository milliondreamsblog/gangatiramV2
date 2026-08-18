// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Prose } from "@/components/ui/Prose";

describe("Prose", () => {
  it("renders the html and carries the paragraph + table prose classes", () => {
    const { container } = render(<Prose html="<p>hi</p><table><tr><td>x</td></tr></table>" />);
    const root = container.firstElementChild!;
    expect(root.innerHTML).toContain("<p>hi</p>");
    expect(root.className).toContain("[&_p]:mb-6");
    expect(root.className).toContain("[&_table]:overflow-x-auto");
    expect(root.className).toContain("[&_li_p]:mb-0");
  });
});
