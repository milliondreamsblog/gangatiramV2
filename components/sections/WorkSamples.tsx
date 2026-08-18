import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { workSamples, workSamplesXl } from "@/content/workSamples";

/**
 * WorkSamples — ported 1:1 from the live Framer homepage's "Work Samples"
 * section (bricxlabs.com): "Our Work" tag pill, centered heading, and a dark
 * "View More" pill (label does the Framer flip on hover) linking to
 * /work, above the project-shot grids. Like Framer, two independent
 * collections swap at the large-desktop breakpoint: 20 shots at 1 column
 * (phones) / 2 columns (810px+), replaced by a different 30-shot set at
 * 3 columns from 1920px. Framer renders the heading in Suisse Intl and the
 * tag/button in Geist; here both map onto the site's Inter at the same
 * sizes, weights, and tracking.
 */
function SampleCard({ src, sizes }: { src: string; sizes: string }) {
  return (
    <div className="relative aspect-[997/1000] w-full overflow-hidden rounded-[24px] border border-[#e3e3e3]">
      <Image src={src} alt="" fill sizes={sizes} className="object-cover" />
    </div>
  );
}

export function WorkSamples() {
  return (
    <section
      id="work-samples"
      className="flex flex-col items-center gap-8 overflow-hidden bg-white px-4 py-12 min-[810px]:gap-14 min-[810px]:px-5 min-[810px]:py-14 min-[1024px]:px-6 min-[1024px]:py-16 min-[1200px]:px-8 min-[1440px]:px-10 min-[1440px]:py-20"
    >
      <div className="flex w-full max-w-[768px] flex-col items-center gap-4">
        <div className="flex items-center rounded-[8px] border border-black/5 bg-white px-3 py-2 shadow-[inset_0_-1px_1px_-0.5px_rgba(51,51,51,0.06),0_1px_2px_rgba(51,51,51,0.04),0_2px_4px_rgba(51,51,51,0.04),0_4px_8px_-2px_rgba(51,51,51,0.06),0_0_0_1px_rgba(51,51,51,0.04)]">
          <p className="text-lg font-medium leading-none tracking-[-0.03em]">
            The Journey
          </p>
        </div>

        <h2 className="text-center text-[36px] font-medium leading-[1.2] tracking-[-0.04em] text-[#262626] min-[810px]:text-[42px] min-[1200px]:text-[48px]">
          Frames from the river
        </h2>

        <a
          href="/work"
          className="group inline-flex items-center gap-2 rounded-full border border-[#e3e3e3] bg-panel-2 px-4 py-3 text-white"
        >
          <ArrowRight size={16} />
          {/* Framer's hover: the label flips up and its clone rotates in. */}
          <span className="relative block overflow-hidden text-base font-medium leading-none tracking-[-0.02em] [perspective:1000px]">
            <span className="block origin-bottom transition-transform duration-300 ease-out group-hover:[transform:translateY(-100%)_rotateX(-90deg)]">
              View More
            </span>
            <span
              aria-hidden
              className="absolute inset-x-0 top-0 block origin-bottom [transform:translateY(100%)_rotateX(90deg)] transition-transform duration-300 ease-out group-hover:[transform:translateY(0)_rotateX(0)]"
            >
              View More
            </span>
          </span>
        </a>
      </div>

      {/* Collection shown below 1920px — 20 shots */}
      <div className="grid w-full grid-cols-1 gap-4 min-[810px]:grid-cols-2 min-[1920px]:hidden">
        {workSamples.map((src) => (
          <SampleCard
            key={src}
            src={src}
            sizes="(max-width: 809px) 100vw, 50vw"
          />
        ))}
      </div>

      {/* Collection shown from 1920px — its own 30-shot set at 3 columns */}
      <div className="hidden w-full grid-cols-3 gap-4 min-[1920px]:grid">
        {workSamplesXl.map((src) => (
          <SampleCard key={src} src={src} sizes="33vw" />
        ))}
      </div>
    </section>
  );
}
