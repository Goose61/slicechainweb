import type { MetadataRoute } from "next";

const BASE_URL = "https://app.slicechain.io";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/business/dashboard/",
        "/business/demo/",
        "/customer/dashboard/",
        "/employee/dashboard/",
        "/transactions/",
        "/vendor-payment/",
        "/portal/",
      ],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
