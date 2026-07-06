import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/"],
      disallow: ["/admin", "/dashboard", "/profile", "/recipient-setup", "/letter", "/animation", "/create", "/login", "/coming-soon"],
    },
    sitemap: "https://everafterletters.xyz/sitemap.xml",
  };
}
