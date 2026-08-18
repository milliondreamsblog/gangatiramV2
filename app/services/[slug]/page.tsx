import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { Container } from "@/components/ui/Container";
import { TrustedBy } from "@/components/sections/TrustedBy";
import { Showcase } from "@/components/sections/Showcase";
import { CtaBand } from "@/components/sections/CtaBand";
import { Faq } from "@/components/sections/Faq";
import { PageHero } from "@/components/sections/PageHero";
import { ServiceProcess } from "./_sections/ServiceProcess";
import { servicePages, getServicePage } from "@/content/servicePages";

export function generateStaticParams() {
  return servicePages.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getServicePage(slug);
  if (!page) return { title: "Services" };
  return {
    title: page.eyebrow,
    description: page.headline,
    alternates: { canonical: `/services/${page.slug}` },
  };
}

export default async function ServiceRoutePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getServicePage(slug);
  if (!page) notFound();

  return (
    <PageShell nav="overlay" layout="clip">
      <PageHero
        variant="photo"
        image={page.heroImage}
        eyebrow={page.eyebrow}
        headline={page.headline}
      />
      <section className="bg-white px-5 py-16 md:px-10 md:py-24">
        <Container padded={false}>
          <p className="max-w-[980px] text-2xl font-medium leading-[1.3] tracking-[-0.02em] text-black md:text-[32px]">
            {page.intro}
          </p>
        </Container>
      </section>
      <TrustedBy />
      <ServiceProcess />
      <CtaBand />
      <Showcase />
      <Faq />
    </PageShell>
  );
}
