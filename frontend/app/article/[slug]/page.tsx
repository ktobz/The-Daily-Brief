import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteShell from "@/components/SiteShell";
import ArticleView from "@/components/article/ArticleView";
import { API_URL } from "@/lib/constants";
import { SITE_URL } from "@/lib/site";
import type { Article, Comment } from "@/lib/types";

interface DetailResponse {
  data: Article;
  related: Article[];
  next_in_world: Article[];
}

async function getArticle(slug: string): Promise<DetailResponse | null> {
  try {
    const res = await fetch(`${API_URL}/articles/${slug}`, { next: { revalidate: 30 } });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Failed to fetch article");
    return (await res.json()) as DetailResponse;
  } catch {
    return null;
  }
}

async function getComments(id: number): Promise<Comment[]> {
  try {
    const res = await fetch(`${API_URL}/articles/${id}/comments`, { next: { revalidate: 15 } });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data as Comment[];
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getArticle(slug);

  if (!detail) {
    return { title: "Article not found" };
  }

  const article = detail.data;
  const description = article.subdeck ?? article.excerpt ?? "";
  const authors = [article.author?.name, ...(article.co_authors ?? []).map((a) => a.name)].filter(
    Boolean
  ) as string[];

  return {
    title: article.title,
    description,
    alternates: {
      canonical: `/article/${article.slug}`,
    },
    openGraph: {
      type: "article",
      url: `${SITE_URL}/article/${article.slug}`,
      title: article.title,
      description,
      siteName: "The Daily Brief",
      publishedTime: article.published_at ?? undefined,
      section: article.category?.name,
      tags: article.tags,
      authors: authors.length > 0 ? authors : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description,
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const detail = await getArticle(slug);

  if (!detail) notFound();

  const comments = await getComments(detail.data.id);
  const article = detail.data;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.subdeck ?? article.excerpt ?? "",
    image: [article.image].filter(Boolean),
    datePublished: article.published_at ?? undefined,
    dateModified: article.published_at ?? undefined,
    articleSection: article.category?.name,
    author: [
      { "@type": "Person", name: article.author?.name ?? "The Daily Brief" },
      ...(article.co_authors ?? []).map((a) => ({ "@type": "Person", name: a.name })),
    ],
    publisher: {
      "@type": "Organization",
      name: "The Daily Brief",
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/article/${article.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteShell showNewsletter={false}>
        <ArticleView
          article={article}
          related={detail.related}
          nextInWorld={detail.next_in_world}
          initialComments={comments}
        />
      </SiteShell>
    </>
  );
}
