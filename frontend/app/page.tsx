import SiteShell from "@/components/SiteShell";
import HomeContent from "@/components/home/HomeContent";
import { API_URL } from "@/lib/constants";
import { getEdition } from "@/lib/edition";
import type { HomeData } from "@/lib/types";

async function getHome(edition: string): Promise<HomeData> {
  try {
    const res = await fetch(`${API_URL}/home?edition=${encodeURIComponent(edition)}`, { next: { revalidate: 30 } });
    if (!res.ok) throw new Error("Failed to fetch home");
    return (await res.json()) as HomeData;
  } catch {
    return { lead: null, hero: [], editors_picks: [], rails: [], wire: [] };
  }
}

export default async function HomePage() {
  const edition = await getEdition();
  const data = await getHome(edition);

  return (
    <SiteShell wire={data.wire} edition={edition}>
      <HomeContent data={data} />
    </SiteShell>
  );
}
