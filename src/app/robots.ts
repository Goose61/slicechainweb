import type { MetadataRoute } from "next";

const BASE_URL = "https://slicechain.io";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/business/dashboard/",
        "/customer/dashboard/",
        "/employee/dashboard/",
        "/transactions/",
        "/vendor-payment/",
      ],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
