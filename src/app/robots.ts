import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/my", "/creator", "/account", "/dashboard", "/settings", "/api/"],
    },
    sitemap: `${process.env.NEXT_PUBLIC_APP_URL || "https://ideavex.com"}/sitemap.xml`,
  };
}
