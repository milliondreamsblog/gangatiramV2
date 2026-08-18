import type { MetadataRoute } from "next";
import { servicePages } from "@/content/servicePages";

const siteUrl = "https://gangatiram.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/buy`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/dev-deepawali`, changeFrequency: "weekly", priority: 0.8 },
  ];
  const chapterEntries: MetadataRoute.Sitemap = servicePages.map((p) => ({
    url: `${siteUrl}/services/${p.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));
  return [...staticEntries, ...chapterEntries];
}
