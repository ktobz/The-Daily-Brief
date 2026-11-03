export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

export const SITE_DESCRIPTION =
  "Authoritative journalism on world affairs, politics, business, technology and culture from Nigeria and beyond.";

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
