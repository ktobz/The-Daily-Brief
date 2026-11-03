import { ImageResponse } from "next/og";
import { API_URL } from "@/lib/constants";

export const alt = "Article — The Daily Brief";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface ArticleResponse {
  data: {
    title: string;
    subdeck?: string | null;
    excerpt?: string | null;
    category?: { name: string } | null;
    author?: { name: string } | null;
    published_at?: string | null;
  };
}

async function getArticle(slug: string) {
  try {
    const res = await fetch(`${API_URL}/articles/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json = (await res.json()) as ArticleResponse;
    return json.data;
  } catch {
    return null;
  }
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticle(slug);

  const title = article?.title ?? "The Daily Brief";
  const section = article?.category?.name ?? "The Daily Brief";
  const byline = article?.author?.name ? `By ${article.author.name}` : "Reporting from The Daily Brief";
  const summary = article?.subdeck ?? article?.excerpt ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#fbf9f6",
          color: "#1a1a1a",
          padding: "56px 68px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 56, height: 5, background: "#b91c1c" }} />
            <div style={{ fontSize: 22, letterSpacing: 8, color: "#b91c1c" }}>THE DAILY BRIEF</div>
          </div>
          <div style={{ fontSize: 20, letterSpacing: 4, textTransform: "uppercase", color: "#6b6560" }}>
            {section}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 60, lineHeight: 1.08, fontWeight: 700, maxWidth: 1050 }}>
            {title.length > 120 ? `${title.slice(0, 117)}…` : title}
          </div>
          {summary && (
            <div style={{ marginTop: 22, fontSize: 26, lineHeight: 1.35, color: "#57514c", maxWidth: 1000 }}>
              {summary.length > 150 ? `${summary.slice(0, 147)}…` : summary}
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid #d8d2ca",
            paddingTop: 20,
            fontSize: 21,
            color: "#6b6560",
          }}
        >
          <span>{byline}</span>
          <span>Independent. Reported. Delivered.</span>
        </div>
      </div>
    ),
    size
  );
}
