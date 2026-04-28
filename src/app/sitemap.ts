import { MetadataRoute } from "next";

const BASE_URL = "https://zamvibe.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/admin`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];
}
