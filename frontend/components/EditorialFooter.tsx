import Link from "next/link";
import { NAV_CATEGORIES, SITE_NAME } from "@/lib/constants";

export default function EditorialFooter() {
  return (
    <footer className="bg-ink text-white/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <span className="font-display text-2xl font-bold text-white">The Daily Brief</span>
            <p className="mt-3 text-sm text-white/50 leading-relaxed">
              Independent journalism for Nigeria and the world.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Sections</h3>
            <ul className="space-y-2 text-sm">
              {NAV_CATEGORIES.map((c) => (
                <li key={c}>
                  <Link href={`/category/${c.toLowerCase()}`} className="hover:text-white transition">
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">About</a></li>
              <li><a href="#" className="hover:text-white transition">Ethics &amp; Standards</a></li>
              <li><a href="#" className="hover:text-white transition">Contact</a></li>
              <li><a href="#" className="hover:text-white transition">Advertise</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">More</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/plans" className="hover:text-white transition">Subscriptions</Link></li>
              <li><Link href="/saved" className="hover:text-white transition">Saved stories</Link></li>
              <li><Link href="/account" className="hover:text-white transition">Account</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p suppressHydrationWarning>© {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
          <p>Built with Next.js · Laravel · Flutterwave · Firebase</p>
        </div>
      </div>
    </footer>
  );
}
