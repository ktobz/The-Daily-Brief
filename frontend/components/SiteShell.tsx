"use client";

import Link from "next/link";
import UtilityBar from "./UtilityBar";
import Masthead from "./Masthead";
import Navbar from "./Navbar";
import LiveWireTicker from "./LiveWireTicker";
import NewsletterBanner from "./NewsletterBanner";
import EditorialFooter from "./EditorialFooter";
import BottomTabs from "./BottomTabs";
import { useAuth } from "@/lib/auth";
import type { WireItem } from "@/lib/types";

export default function SiteShell({
  children,
  wire,
  edition = "Lagos",
  showChrome = true,
  showNewsletter = true,
}: {
  children: React.ReactNode;
  wire?: WireItem[];
  edition?: string;
  showChrome?: boolean;
  showNewsletter?: boolean;
}) {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen pb-16 lg:pb-0">
      {showChrome && (
        <>
          <UtilityBar edition={edition} />
          <Masthead />
          <Navbar />
          <LiveWireTicker items={wire ?? []} />
        </>
      )}

      <main className="flex-1">{children}</main>

      {showNewsletter && <NewsletterBanner />}
      {showChrome && <EditorialFooter />}
      {showChrome && <BottomTabs />}
    </div>
  );
}
