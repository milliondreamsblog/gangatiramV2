import { AnnouncementBar } from "@/components/sections/AnnouncementBar";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";

export function PageShell({
  nav = "solid",
  announcement = false,
  footer = true,
  layout = "stacked",
  srHeading,
  children,
}: {
  nav?: "solid" | "overlay" | "fixed";
  announcement?: boolean;
  footer?: boolean;
  layout?: "stacked" | "clip";
  /** Optional visually-hidden page <h1>, rendered as the first child above the chrome. */
  srHeading?: string;
  children: React.ReactNode;
}) {
  const inner = (
    <>
      {srHeading && <h1 className="sr-only">{srHeading}</h1>}
      {announcement && <AnnouncementBar />}
      <Navbar variant={nav} />
      {children}
      {footer && <Footer />}
    </>
  );
  return layout === "clip" ? (
    <main className="relative w-full overflow-x-clip bg-white text-[#121212]">{inner}</main>
  ) : (
    inner
  );
}
