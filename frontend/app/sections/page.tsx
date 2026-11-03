import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import { API_URL } from "@/lib/constants";
import type { Category } from "@/lib/types";

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_URL}/categories`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data as Category[];
  } catch {
    return [];
  }
}

export default async function SectionsPage() {
  const categories = await getCategories();

  return (
    <SiteShell showNewsletter={false}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <h1 className="font-display text-3xl font-bold mb-8">Sections</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className="group border border-hairline-strong bg-surface-low p-5 hover:border-accent transition"
            >
              <span className="inline-block h-1.5 w-8 rounded-full mb-3" style={{ background: c.color || "#b91c1c" }} />
              <p className="font-serif font-bold text-ink group-hover:text-accent transition">{c.name}</p>
              {c.children && c.children.length > 0 && (
                <p className="mt-1 text-xs text-ink-variant">{c.children.map((x) => x.name).join(" · ")}</p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
