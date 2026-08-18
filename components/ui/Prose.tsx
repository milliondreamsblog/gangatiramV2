import { cn } from "@/lib/utils";

// Verbatim from app/ux-agencies/[slug]/page.tsx (canonical article prose).
const PROSE =
  "[&_p]:mb-6 [&_p]:text-base [&_p]:leading-[1.5] [&_p]:tracking-[-0.01em] [&_p]:text-black/70 " +
  "[&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:scroll-mt-24 [&_h2]:text-xl [&_h2]:font-medium [&_h2]:leading-[1.3] [&_h2]:tracking-[-0.02em] [&_h2]:text-black [&_h2]:first:mt-0 " +
  "[&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:scroll-mt-24 [&_h3]:text-lg [&_h3]:font-medium [&_h3]:tracking-[-0.02em] [&_h3]:text-black " +
  "[&_ul]:mb-5 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2.5 [&_ul]:pl-5 " +
  "[&_ol]:mb-5 [&_ol]:flex [&_ol]:flex-col [&_ol]:gap-2.5 [&_ol]:pl-5 " +
  "[&_li]:list-disc [&_li]:text-base [&_li]:leading-[1.5] [&_li]:tracking-[-0.01em] [&_li]:text-black/70 [&_li]:marker:text-black/40 " +
  "[&_ol_li]:list-decimal [&_li_p]:mb-0 " +
  "[&_a]:font-medium [&_a]:text-black [&_a]:underline [&_a]:underline-offset-2 " +
  "[&_strong]:font-semibold [&_strong]:text-black " +
  "[&_img]:my-6 [&_img]:w-full [&_img]:rounded-lg " +
  "[&_blockquote]:my-6 [&_blockquote]:border-l-2 [&_blockquote]:border-black/15 [&_blockquote]:pl-4 [&_blockquote]:text-black/60 " +
  "[&_table]:my-6 [&_table]:block [&_table]:w-full [&_table]:overflow-x-auto [&_table]:border-collapse [&_table]:text-sm [&_th]:border [&_th]:border-line-soft [&_th]:bg-surface [&_th]:p-2.5 [&_th]:text-left [&_td]:border [&_td]:border-line-soft [&_td]:p-2.5 [&_td]:align-top [&_td]:text-black/70";

export function Prose({ html, className }: { html: string; className?: string }) {
  return <div className={cn(PROSE, className)} dangerouslySetInnerHTML={{ __html: html }} />;
}
