import type { MetadataRoute } from "next";
import { posts } from "./posts";

const siteUrl = "https://hoshikuzu-note-blog.netlify.app";
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date("2026-08-26"),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...posts.map((post) => ({
      url: `${siteUrl}/posts/${post.slug}`,
      lastModified: new Date(`2026-${post.date.replace(".", "-")}`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
