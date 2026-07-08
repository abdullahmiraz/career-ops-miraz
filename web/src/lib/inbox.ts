// Pure, client-side derivations for the inbox triage view. Every signal here is
// FREE — parsed from data the raw posting already carries (URL host, title text,
// first_seen date). 🔴 None of this ranks or scores relevance; it only labels and
// buckets so the cheap facet filters can narrow the firehose with zero tokens.

import type { AtsSource } from "@/lib/explore";

/** Which ATS a posting lives on, derived from its URL host (0 tokens, no network).
 *  Matches on the registrable domain anchored at a dot boundary (host === base OR
 *  host ends with ".base") — never a bare substring, so "greenhouse.io.evil.com"
 *  or "notlever.co" can't be misread as that ATS. */
export function sourceFromUrl(url: string): AtsSource | null {
  let host = "";
  try {
    host = new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }
  const domainIs = (base: string) => host === base || host.endsWith(`.${base}`);
  if (domainIs("greenhouse.io")) return "greenhouse";
  if (domainIs("lever.co")) return "lever";
  if (domainIs("ashbyhq.com")) return "ashby";
  if (domainIs("myworkdayjobs.com") || domainIs("workday.com")) return "workday";
  return null;
}

// Coarse seniority buckets, detected from the title. Ordered senior→junior so the
// facet chips read top-down; a title that matches nothing gets no tag (still shows,
// just untagged). We only ever surface buckets that actually appear in the data.
export type Seniority = "lead" | "staff" | "senior" | "mid" | "junior" | "intern";
export const SENIORITY_ORDER: Seniority[] = ["lead", "staff", "senior", "mid", "junior", "intern"];
export const SENIORITY_LABEL: Record<Seniority, string> = {
  lead: "Lead / Mgr",
  staff: "Staff+",
  senior: "Senior",
  mid: "Mid",
  junior: "Junior",
  intern: "Intern",
};

export function seniorityFromTitle(title: string): Seniority | null {
  const t = ` ${title.toLowerCase()} `;
  if (/\b(head|vp|vice president|director|chief|manager|mgr|lead)\b/.test(t)) return "lead";
  if (/\b(staff|principal|distinguished|fellow|architect)\b/.test(t)) return "staff";
  if (/\b(senior|sr\.?|snr)\b/.test(t)) return "senior";
  if (/\b(junior|jr\.?|entry|graduate|associate)\b/.test(t)) return "junior";
  if (/\b(intern|internship|working student|apprentice)\b/.test(t)) return "intern";
  // an untagged IC role sits in the broad middle
  if (/\b(engineer|developer|scientist|designer|analyst|manager|specialist|consultant)\b/.test(t)) return "mid";
  return null;
}

// How a posting was found — the free zero-token scan (ATS/board feeds) vs. an
// agent-run AI web search (modes/discover.md). Derived from scan-history.tsv's
// source column (joined onto InboxJob as discoverySource); a posting scan.mjs
// never recorded a source for defaults to "scan" (the common case).
export type DiscoveryMethod = "scan" | "ai-search";
export const DISCOVERY_METHOD_ORDER: DiscoveryMethod[] = ["ai-search", "scan"];
export const DISCOVERY_METHOD_LABEL: Record<DiscoveryMethod, string> = {
  "ai-search": "AI Search",
  scan: "Scan",
};

export function discoveryMethodFromSource(source: string | undefined): DiscoveryMethod {
  return source === "ai-search" ? "ai-search" : "scan";
}

// Coarse regional market bucket — derived from the posting's URL host (national/
// regional boards) or, failing that, its location text. Only the markets the
// candidate actually asked to track are bucketed; anything else is unbucketed
// (still shows, just doesn't get a Market chip) rather than forced into "Other".
export type Market = "bangladesh" | "russia";
export const MARKET_ORDER: Market[] = ["bangladesh", "russia"];
export const MARKET_LABEL: Record<Market, string> = {
  bangladesh: "Bangladesh",
  russia: "Russia",
};

export function marketFromUrlOrLocation(url: string, location: string | undefined): Market | null {
  let host = "";
  try {
    host = new URL(url).hostname.toLowerCase();
  } catch {
    host = "";
  }
  const domainIs = (base: string) => host === base || host.endsWith(`.${base}`);
  if (domainIs("bdjobs.com") || domainIs("skill.jobs")) return "bangladesh";
  if (
    domainIs("hh.ru") ||
    domainIs("career.habr.com") ||
    domainIs("getmatch.ru") ||
    domainIs("rabota.ru") ||
    domainIs("tbank.ru") ||
    domainIs("yandex.ru") ||
    domainIs("sber.ru")
  )
    return "russia";

  const loc = (location || "").toLowerCase();
  if (/bangladesh|dhaka|chittagong|chattogram|sylhet/.test(loc)) return "bangladesh";
  if (/russia|moscow|москв|росси|санкт-петербург|saint petersburg|st\.?\s*petersburg/i.test(loc)) return "russia";
  return null;
}

/** Whole days between an ISO date (YYYY-MM-DD) and now; null if unparseable. */
export function daysSince(iso: string | undefined, now: number): number | null {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const t = Date.parse(`${iso}T00:00:00Z`);
  if (Number.isNaN(t)) return null;
  return Math.floor((now - t) / 86_400_000);
}

// Freshness windows mirror the Explore "posted within" segmented control so the two
// surfaces feel like one system. A posting passes a window if its age ≤ the window.
export const FRESHNESS_WINDOWS = [
  { label: "24h", days: 1 },
  { label: "3d", days: 3 },
  { label: "7d", days: 7 },
  { label: "14d", days: 14 },
  { label: "30d", days: 30 },
] as const;
