import type { HomeData } from "@/lib/types";
import LeadArticle from "./LeadArticle";
import LatestWire from "./LatestWire";
import TopStoriesGrid from "./TopStoriesGrid";
import OpinionSection from "./OpinionSection";
import CategoryRail from "./CategoryRail";
import CategoryChips from "../mobile/CategoryChips";

export default function HomeContent({ data }: { data: HomeData }) {
  const opinionRail = data.rails.find((r) => r.category.slug === "opinion");
  const otherRails = data.rails.filter((r) => r.category.slug !== "opinion");

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-12">
      <CategoryChips />

      {/* Lead + wire */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <LeadArticle article={data.lead ?? data.hero[0]} />
        </div>
        <div className="lg:col-span-1">
          <LatestWire items={data.wire} />
        </div>
      </div>

      {/* Top stories */}
      {data.hero.length > 1 && <TopStoriesGrid articles={data.hero.slice(1, 7)} />}

      {/* Opinion */}
      <OpinionSection articles={opinionRail?.articles ?? data.editors_picks} />

      {/* Section rails */}
      {otherRails.map((rail) => (
        <CategoryRail
          key={rail.category.slug}
          title={rail.category.name}
          color={rail.category.color}
          slug={rail.category.slug}
          articles={rail.articles}
        />
      ))}
    </div>
  );
}
