import type { MetadataRoute } from "next";

const BASE_URL = "https://slicechain.io";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: `${BASE_URL}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/privacy/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/terms/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
