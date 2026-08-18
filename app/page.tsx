import { PageHero } from "@/components/sections/PageHero";
import { BookCatalogue } from "@/components/sections/BookCatalogue";
import { FaceTabs } from "@/components/sections/FaceTabs";
import { TrustedBy } from "@/components/sections/TrustedBy";
import { SpecialEdition } from "@/components/sections/SpecialEdition";
import { Services } from "@/components/sections/Services";
import { Testimonials } from "@/components/sections/Testimonials";
import { Team } from "@/components/sections/Team";
import { Faq } from "@/components/sections/Faq";
import { WorkSamples } from "@/components/sections/WorkSamples";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <main className="flex-1">
        <PageHero variant="home" />
        <TrustedBy />
        <BookCatalogue />
        <FaceTabs />
        <SpecialEdition />
        <Services />
        <Testimonials />
        <Team />
        <Faq />
        <WorkSamples />
      </main>
      <Footer />
    </>
  );
}
