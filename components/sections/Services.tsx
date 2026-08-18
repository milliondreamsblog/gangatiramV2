"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { services, servicesHeading } from "@/content/services";
import { hoverFeedback } from "@/lib/feedback";
import { Container } from "@/components/ui/Container";

export function Services() {
  return (
    <section id="services" className="scroll-mt-20 bg-white px-5 py-16 md:px-10 md:py-24">
      <Container padded={false}>
        <div className="mb-10 flex flex-col gap-2 md:mb-16 md:flex-row md:items-start md:justify-between">
          <h2 className="text-3xl font-medium tracking-[-0.02em] md:text-5xl md:leading-[1.05]">
            <span className="text-black/35">{servicesHeading[0]}</span>
            <br />
            {servicesHeading[1]}
          </h2>
          <p className="shrink-0 text-sm text-ink-faint md:pt-2">
            75 places · 2,525 kilometres · told in river order
          </p>
        </div>

        <div className="flex flex-col">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.04 }}
              onMouseEnter={() => hoverFeedback("service")}
              className="service-row group -mx-4 grid grid-cols-1 items-stretch overflow-hidden rounded-none border-t border-black/10 transition-colors duration-200 hover:border-transparent hover:bg-[#f2f2f2] md:-mx-8 md:grid-cols-[1.1fr_300px_1fr] md:[grid-template-rows:248px]"
            >
              {/* Number + title */}
              <div className="flex items-center gap-4 px-4 py-6 md:gap-6 md:px-8 md:py-8">
                <span className="text-sm text-black/70">{service.number}</span>
                <h3 className="text-2xl font-medium tracking-[-0.02em] md:text-4xl">
                  {service.title}
                </h3>
              </div>

              {/* Thumbnail column — fills the full row height. Padded (contained)
                  by default; on hover the padding collapses so the image becomes
                  a full-bleed, full-height band. No image rounding — the rounded
                  row clips it, matching Figma. */}
              <div className="relative min-h-40 overflow-hidden md:min-h-44">
                <div className="absolute inset-x-4 inset-y-4 overflow-hidden transition-all duration-300 ease-out group-hover:inset-y-0 md:inset-x-0 md:inset-y-8">
                  <Image
                    src={service.image}
                    alt={`${service.title} preview`}
                    fill
                    sizes="(max-width: 767px) calc(100vw - 40px), 300px"
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Description + arrow */}
              <div className="flex flex-col justify-between gap-4 px-4 py-6 md:px-8 md:py-8">
                <p className="max-w-md text-[15px] leading-relaxed text-[#6b6b6b]">
                  {service.description}
                </p>
                <a
                  href={`/services/${service.slug}`}
                  aria-label={`Learn more about ${service.title}`}
                  className="grid size-11 place-items-center rounded-lg bg-black/5 text-black transition-colors hover:bg-black/10 md:size-9"
                >
                  <ArrowUpRight size={18} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
