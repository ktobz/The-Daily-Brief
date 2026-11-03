export interface AudioChapter {
  time: number;
  label: string;
}

export interface TranscriptSegment {
  start: number;
  end: number;
  speaker: string;
  role: string;
  text: string;
}

export interface AudioEpisode {
  id: string;
  title: string;
  subtitle: string;
  duration: number;
  publishedAt: string;
  image: string;
  imageCaption: string;
  verified: boolean;
  chapters: AudioChapter[];
  transcript: TranscriptSegment[];
  takeaways: string[];
}

export interface BroadcastSlot {
  time: string;
  title: string;
  duration: string;
  status: "listened" | "top" | "scheduled" | "new";
  fieldAudio?: boolean;
}

export interface AudioSeries {
  id: string;
  title: string;
  description: string;
  episodes: number;
  image: string;
  exclusive?: boolean;
}

export const PODCAST_PLATFORMS = ["Apple Podcasts", "Spotify", "Overcast", "Pocket Casts"] as const;

export const leadEpisode: AudioEpisode = {
  id: "geneva-accord-sovereign-debt",
  title: "The Geneva Accord & the Repricing of Sovereign Debt",
  subtitle:
    "Inside the 48-hour negotiation that reshaped the climate framework — and the market response rippling through credit spreads across emerging economies.",
  duration: 1110,
  publishedAt: "2026-10-09T06:00:00Z",
  image: "https://placehold.co/1200x675/1a1a1a/f5f3f0?text=Dispatch+Studio",
  imageCaption:
    "The Dispatches & Sound studio: a broadcast-grade Shure SM7B desk prepared for the morning recording session.",
  verified: true,
  chapters: [
    { time: 0, label: "Intro" },
    { time: 255, label: "Plenary Stalemate" },
    { time: 520, label: "Sovereign Debt Repricing" },
    { time: 860, label: "Asian FX Reactions" },
  ],
  transcript: [
    {
      start: 0,
      end: 34,
      speaker: "Amara Okafor",
      role: "Host",
      text: "You're listening to Dispatches & Sound. I'm Amara Okafor, and this is the morning wire.",
    },
    {
      start: 34,
      end: 96,
      speaker: "Elena Rostova",
      role: "Diplomatic Correspondent",
      text: "By the second evening in Geneva, the plenary had effectively stalled. Three large-emitting economies refused to sign unless the compliance schedule was staggered.",
    },
    {
      start: 96,
      end: 168,
      speaker: "David K. Chen",
      role: "Climate Editor",
      text: "The turning point came when Nigeria and Brazil tabled a joint amendment linking ratification to access to the transition fund. That unlocked the room.",
    },
    {
      start: 168,
      end: 244,
      speaker: "Marcus Sterling",
      role: "Markets Editor",
      text: "Within hours, credit markets began repricing. Nigerian sovereign spreads tightened roughly eighteen basis points, and the move cascaded into Indonesia and Vietnam.",
    },
    {
      start: 244,
      end: 320,
      speaker: "Amara Okafor",
      role: "Host",
      text: "Marcus, help us understand why a climate accord moves sovereign credit that quickly.",
    },
    {
      start: 320,
      end: 420,
      speaker: "Marcus Sterling",
      role: "Markets Editor",
      text: "Because the fund is conditional. Markets read the text as a near-term fiscal backstop for emerging issuers — and that changes the default calculus almost immediately.",
    },
    {
      start: 420,
      end: 505,
      speaker: "Elena Rostova",
      role: "Diplomatic Correspondent",
      text: "The final hours were exhausting. Delegates worked through two nights, and the independent audit mechanism was the last item to fall.",
    },
    {
      start: 505,
      end: 600,
      speaker: "David K. Chen",
      role: "Climate Editor",
      text: "What was agreed is ambitious on paper. The real test is domestic ratification, and we should not underestimate how hard that will be.",
    },
    {
      start: 600,
      end: 700,
      speaker: "Marcus Sterling",
      role: "Markets Editor",
      text: "In Asia, the FX reaction was immediate. The ringgit and the won both strengthened as funds rotated into markets seen as early beneficiaries of the framework.",
    },
    {
      start: 700,
      end: 780,
      speaker: "Amara Okafor",
      role: "Host",
      text: "That's the picture for now. The full transcript and executive takeaways are below, and the evening cap will carry the cross-asset wrap.",
    },
  ],
  takeaways: [
    "A staggered compliance schedule unlocked the final vote after 48 hours of deadlock.",
    "Nigeria and Brazil's joint amendment tied ratification to transition-fund access.",
    "Nigerian sovereign spreads tightened ~18bp within hours; the move cascaded to Indonesia and Vietnam.",
    "Independent annual audits under the UN secretariat will monitor national progress.",
    "The real test now shifts to domestic ratification across 190 signatories.",
  ],
};

export const broadcastLineup: BroadcastSlot[] = [
  {
    time: "06:00",
    title: "The World Morning Wire",
    duration: "6 min",
    status: "listened",
  },
  {
    time: "08:00",
    title: "Global Markets Opening Bell: London & Frankfurt",
    duration: "9 min",
    status: "top",
  },
  {
    time: "12:30",
    title: "Strait of Malacca Maritime Rerouting",
    duration: "14 min",
    status: "new",
    fieldAudio: true,
  },
  {
    time: "17:30",
    title: "Evening Cap & Cross-Asset Wrap",
    duration: "Scheduled",
    status: "scheduled",
  },
];

export const audioSeries: AudioSeries[] = [
  {
    id: "shadow-corridors",
    title: "Shadow Corridors",
    description: "How critical minerals flow through unmarked ports — a five-part investigation.",
    episodes: 5,
    image: "https://placehold.co/800x500/1a1a1a/f5f3f0?text=Shadow+Corridors",
  },
  {
    id: "yield-curve-paradox",
    title: "The Yield Curve Paradox",
    description: "Central banks at the precipice — three episodes on the limits of monetary policy.",
    episodes: 3,
    image: "https://placehold.co/800x500/8f1414/f5f3f0?text=Yield+Curve",
  },
  {
    id: "voice-of-the-diplomat",
    title: "Voice of the Diplomat",
    description: "Uncut audio from closed-door summits. Subscriber vault exclusive.",
    episodes: 6,
    image: "https://placehold.co/800x500/5a5855/f5f3f0?text=Voice+of+the+Diplomat",
    exclusive: true,
  },
];

export function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
