import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Pill } from "@/components/ui/Pill";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Prose } from "@/components/ui/Prose";

export const metadata: Metadata = { title: "Components", robots: { index: false, follow: false } };

function Row({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-line py-8">
      <p className="mb-4 text-sm font-medium text-ink-faint">{title}</p>
      <div className="flex flex-wrap items-center gap-4">{children}</div>
    </div>
  );
}

export default function ComponentsGallery() {
  return (
    <main className="bg-white text-black">
      <Container>
        <h1 className="py-10 text-3xl font-medium tracking-[-0.02em]">Component Gallery</h1>
        <Row title="Pill — chip / tab">
          <Pill>Website Design</Pill>
          <Pill variant="tab">All</Pill>
        </Row>
        <Row title="Button — primary / light / ghost">
          <Button href="/book-a-call">Book a call</Button>
          <span className="rounded-full bg-black p-2"><Button href="/x" variant="light">Book a call</Button></span>
          <Button variant="ghost">Services</Button>
        </Row>
        <Row title="Card">
          <Card className="max-w-xs">Need help? Talk to our team.</Card>
        </Row>
        <Row title="SectionHeader — lg with/without split">
          <div className="w-full space-y-6">
            <SectionHeader eyebrow="Blogs" title="7 Best Agencies for B2B SaaS" />
            <SectionHeader eyebrow="Directory" title="Design Systems" />
          </div>
        </Row>
        <Row title="Prose">
          <Prose
            className="w-full"
            html="<h2>Heading</h2><p>Body with a <a href='#'>link</a> and <strong>bold</strong>.</p><ul><li>one</li><li>two</li></ul><table><thead><tr><th>Plan</th><th>Price</th></tr></thead><tbody><tr><td>Starter</td><td>$99</td></tr><tr><td>Pro</td><td>$299</td></tr></tbody></table>"
          />
        </Row>
        <Section id="section-demo" className="w-full">
          <p className="text-ink-muted">Section primitive: page container + py rhythm.</p>
        </Section>
      </Container>
    </main>
  );
}
