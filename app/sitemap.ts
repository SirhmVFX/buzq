import type { MetadataRoute } from "next";
import { COMPARE, POSTS, USE_CASES } from "@/lib/content";
import { siteUrl } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const paths = [
    "",
    "/features",
    "/how-it-works",
    "/pricing",
    "/docs",
    "/docs/quickstart",
    "/docs/api",
    "/docs/sdks",
    "/docs/channels",
    "/docs/invites",
    "/use-cases",
    "/blog",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    "/security",
    "/integrations",
    "/changelog",
    "/careers",
    "/customers",
    "/status",
    "/observability",
    "/incident-response",
    "/for-ctos",
    "/login",
    "/signup",
    "/enterprise",
    "/paid-vs-free",
    "/accessibility",
    "/what-is-buzq",
    "/demo",
    "/help",
    "/small-business",
    "/productivity",
    "/trust",
    "/download",
    "/community",
    "/events",
    "/news",
    "/media-kit",
    ...USE_CASES.map((u) => `/use-cases/${u.slug}`),
    ...POSTS.map((p) => `/blog/${p.slug}`),
    ...COMPARE.map((c) => `/compare/${c.slug}`),
  ];
  return paths.map((path) => ({
    url: `${base}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));
}
