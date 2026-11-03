import type { MetadataRoute } from "next";
import { API_URL } from "@/lib/constants";
import { SITE_URL } from "@/lib/site";
import type { Article, Category } from "@/lib/types";

export const revalidate = 3600;

interface ArticleListResponse {
  data: Article[];
}

interface CategoryListResponse {
  data: Category[];
}

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articlesResponse, categoriesResponse] = await Promise.all([
    fetchJson<ArticleListResponse>("/articles?per_page=100"),
    fetchJson<CategoryListResponse>("/categories"),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "hourly", priority: 1 },
    { url: `${SITE_URL}/wire`, changeFrequency: "hourly", priority: 0.8 },
    { url: `${SITE_URL}/sections`, changeFrequency: "daily", priority: 0.7 },
    { url: `${SITE_URL}/audio`, changeFrequency: "daily", priority: 0.7 },
    { url: `${SITE_URL}/markets`, changeFrequency: "hourly", priority: 0.7 },
    { url: `${SITE_URL}/plans`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/search`, changeFrequency: "weekly", priority: 0.4 },
  ];

  const articleRoutes: MetadataRoute.Sitemap =
    articlesResponse?.data?.map((article) => ({
      url: `${SITE_URL}/article/${article.slug}`,
      lastModified: article.published_at ? new Date(article.published_at) : undefined,
      changeFrequency: "weekly",
      priority: 0.9,
    })) ?? [];

  const categoryRoutes: MetadataRoute.Sitemap =
    categoriesResponse?.data?.map((category) => ({
      url: `${SITE_URL}/category/${category.slug}`,
      changeFrequency: "daily",
      priority: 0.7,
    })) ?? [];

  return [...staticRoutes, ...articleRoutes, ...categoryRoutes];
}
