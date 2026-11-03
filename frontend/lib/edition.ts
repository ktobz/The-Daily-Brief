import { cookies } from "next/headers";

export const DEFAULT_EDITION = "Lagos";
export const EDITIONS = ["Lagos", "International"] as const;

export async function getEdition(): Promise<string> {
  const store = await cookies();
  const value = store.get("edition")?.value;
  return value === "International" ? "International" : DEFAULT_EDITION;
}
