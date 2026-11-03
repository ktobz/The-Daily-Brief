export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const SITE_NAME = "The Daily Brief";
export const SITE_TAGLINE = "Nigeria & World News";

export const EDITIONS = ["Lagos", "International"] as const;

export const NAV_CATEGORIES = [
  "World",
  "Politics",
  "Business",
  "Technology",
  "Culture",
  "Opinion",
] as const;

export const MOBILE_TABS = ["Stories", "Wire", "Opinion", "Saved", "Sections"] as const;

export const MARKET_INDICATORS = [
  { symbol: "NGX ASI", value: "98,412.10", change: "+0.42%", isPositive: true },
  { symbol: "NGN/USD", value: "1,521.30", change: "-0.18%", isPositive: false },
  { symbol: "BRENT", value: "$74.12", change: "+1.03%", isPositive: true },
  { symbol: "BITCOIN", value: "$67,240", change: "+2.14%", isPositive: true },
];

export const FIREBASE_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
};
