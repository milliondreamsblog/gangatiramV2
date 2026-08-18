import { splitTitle } from "@/components/ui/SectionHeader";
import { Toc } from "@/components/shared/Toc";

export function ArticleLayout({
  pills,
  title,
  excerpt,
  toc,
  sidebar,
  related,
  children,
}: {
  pills: string[];
  title: string;
  excerpt?: string;
  toc: { text: string; id: string }[];
  sidebar: React.ReactNode;
  related?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { lead, rest } = splitTitle(title, " for ");
  return (
    <article>
      <header className="mx-auto w-full max-w-[1440px] px-5 pb-10 pt-12 md:px-10 md:pb-10 md:pt-20">
        <div className="flex flex-wrap items-center gap-2.5">
          {pills.map((p, i) => (
            <span
              key={i}
              className="flex h-7 items-center rounded-full bg-[#fafafa] px-3 text-sm tracking-[-0.01em] text-black"
            >
              {p}
            </span>
          ))}
        </div>
        <h1 className="mt-5 max-w-[1080px] text-[clamp(2.75rem,5vw,58px)] font-normal leading-[1.08] tracking-[-0.04em] text-black">
          <span className={`block ${rest ? "text-black/60" : "text-black"}`}>{lead}</span>
          {rest && <span className="block">{rest}</span>}
        </h1>
        {excerpt && (
          <p className="mt-5 max-w-[760px] text-lg leading-[1.5] tracking-[-0.01em] text-black/55">
            {excerpt}
          </p>
        )}
      </header>

      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-12 px-5 py-[60px] md:px-10 lg:grid-cols-[minmax(0,280px)_minmax(0,720px)_minmax(0,280px)] lg:gap-10">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <Toc items={toc} />
          </div>
        </aside>
        {children}
        {sidebar}
      </div>
      {related}
    </article>
  );
}
