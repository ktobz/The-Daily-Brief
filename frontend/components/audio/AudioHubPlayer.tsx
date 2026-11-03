"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { leadEpisode, formatTime, type TranscriptSegment } from "@/lib/audio";

const BAR_COUNT = 96;
const CAMS = ["Desk Cam 01", "Floor Mic 02", "Meter Bridge"];

function bars(): number[] {
  return Array.from({ length: BAR_COUNT }, (_, i) => {
    const a = Math.abs(Math.sin(i * 12.9898) * 43758.5453 % 1);
    const b = Math.abs(Math.sin((i + 7) * 3.73) * 0.6);
    return 0.18 + 0.82 * (a * 0.55 + b * 0.45);
  });
}

function timecode(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600).toString().padStart(2, "0");
  const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, "0");
  const s = Math.floor(totalSeconds % 60).toString().padStart(2, "0");
  const f = Math.floor((totalSeconds % 1) * 24).toString().padStart(2, "0");
  return `${h}:${m}:${s}:${f}`;
}

export default function AudioHubPlayer() {
  const ep = leadEpisode;
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(522);
  const [speed, setSpeed] = useState(1);
  const [view, setView] = useState<"transcript" | "takeaways">("transcript");
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<"live" | "cut">("live");
  const [cam, setCam] = useState(CAMS[0]);
  const [sync, setSync] = useState(true);
  const [saved, setSaved] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const waveform = useMemo(() => bars(), []);

  useEffect(() => {
    if (!playing) return;
    timer.current = setInterval(() => {
      setCurrent((c) => {
        const next = c + 0.25 * speed;
        if (next >= ep.duration) {
          setPlaying(false);
          return ep.duration;
        }
        return next;
      });
    }, 250);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [playing, speed, ep.duration]);

  const progress = Math.min(current / ep.duration, 1);

  function seek(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    setCurrent(Math.max(0, Math.min(ep.duration, ratio * ep.duration)));
  }

  function jumpTo(time: number) {
    setCurrent(time);
    setPlaying(true);
  }

  function skip(delta: number) {
    setCurrent((c) => Math.max(0, Math.min(ep.duration, c + delta)));
  }

  async function copyTimestamp(s: TranscriptSegment) {
    try {
      await navigator.clipboard.writeText(`[${formatTime(s.start)}] ${s.speaker} — "${s.text}"`);
    } catch {
      // ignore
    }
  }

  async function clipShare(s: TranscriptSegment) {
    const text = `"${s.text}" — ${s.speaker} (${formatTime(s.start)}) via Dispatches & Sound`;
    try {
      if (navigator.share) await navigator.share({ text });
      else await navigator.clipboard.writeText(text);
    } catch {
      // ignore
    }
  }

  const activeSegment: TranscriptSegment | null =
    view === "transcript"
      ? ep.transcript.find((s) => current >= s.start && current <= s.end) ?? null
      : null;

  const visibleTranscript = ep.transcript.filter(
    (s) =>
      query.trim() === "" ||
      s.text.toLowerCase().includes(query.toLowerCase()) ||
      s.speaker.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="rounded-lg overflow-hidden bg-[#0f1013] text-white shadow-2xl ring-1 ring-black/40">
      {/* Telemetry / status bar */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 px-4 py-2.5 border-b border-white/10 bg-[#15161b] font-mono text-[10px] tracking-wide text-gray-400">
        <span className="text-gray-500">AES-67 STUDIO MASTER</span>
        <span className="text-white/70">96kHz / 24-BIT LOSSLESS FLAC</span>
        <span className="text-gray-500">LATENCY: 14ms (DIRECT LEASED FIBRE)</span>
        <span className="ml-auto flex items-center gap-2 text-red-400 font-semibold">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </span>
          ON AIR • GENEVA BUREAU RELAY
        </span>
      </div>

      {/* Stream mode toggle */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
        <div className="flex rounded-sm border border-white/15 overflow-hidden text-[11px] font-semibold">
          <button
            onClick={() => setMode("live")}
            className={`px-3 py-1.5 tracking-wide ${mode === "live" ? "bg-red-600 text-white" : "text-gray-400 hover:text-white"}`}
          >
            STUDIO LIVE WIRE
          </button>
          <button
            onClick={() => setMode("cut")}
            className={`px-3 py-1.5 tracking-wide ${mode === "cut" ? "bg-white/15 text-white" : "text-gray-400 hover:text-white"}`}
          >
            EXECUTIVE MASTER CUT
          </button>
        </div>
        <span className="text-[11px] text-gray-500">{mode === "cut" ? "Master cut" : "Live"} · [18m 30s]</span>
      </div>

      <div className="grid lg:grid-cols-2">
        {/* Left: studio cam + waveform + controls */}
        <div className="p-4 sm:p-6 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col">
          {/* Studio cam monitor */}
          <div className="relative rounded-sm bg-black border border-white/10 overflow-hidden aspect-video">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ep.image} alt={ep.title} className="h-full w-full object-cover opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

            {/* REC timecode */}
            <div className="absolute top-2.5 left-2.5 flex items-center gap-2 font-mono text-[10px]">
              <span className="flex items-center gap-1.5 rounded-sm bg-black/70 px-2 py-0.5 text-red-400 font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" /> REC
              </span>
              <span className="rounded-sm bg-black/70 px-2 py-0.5 text-white/90">[{timecode(current)}]</span>
            </div>

            {/* Multi-track status */}
            <div className="absolute top-2.5 right-2.5 rounded-sm bg-black/70 px-2 py-0.5 font-mono text-[10px] text-emerald-400">
              4 TRACKS ● LIVE
            </div>

            {/* Camera switcher pills */}
            <div className="absolute bottom-2.5 left-2.5 flex gap-1.5">
              {CAMS.map((c) => (
                <button
                  key={c}
                  onClick={() => setCam(c)}
                  className={`rounded-sm px-2 py-1 text-[9px] font-semibold tracking-wide transition ${
                    cam === c ? "bg-white text-black" : "bg-black/60 text-white/70 hover:bg-black/80"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="mt-4 flex items-start gap-3">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.2em] text-red-400 font-semibold">Dispatches &amp; Sound</p>
              <h1 className="mt-1 font-display text-xl sm:text-2xl font-bold leading-tight text-white">{ep.title}</h1>
            </div>
          </div>

          {/* Waveform */}
          <div className="mt-5">
            <div className="flex items-center justify-between text-[10px] font-mono text-gray-500 mb-1.5">
              <span className="text-white/80 tabular-nums">{formatTime(current)}</span>
              <span className="tabular-nums">{formatTime(ep.duration)}</span>
            </div>

            <div className="relative cursor-pointer select-none" onClick={seek}>
              <div className="flex items-end gap-[2px] h-24">
                {waveform.map((h, i) => {
                  const active = i / BAR_COUNT <= progress;
                  return (
                    <span
                      key={i}
                      className={`flex-1 rounded-full transition-colors ${active ? "bg-red-500" : "bg-white/15"}`}
                      style={{ height: `${h * 100}%` }}
                    />
                  );
                })}
              </div>

              {/* Playhead */}
              <div
                className="absolute top-0 bottom-0 w-px bg-white pointer-events-none"
                style={{ left: `${progress * 100}%` }}
              >
                <div className="absolute -top-1 -left-[5px] h-2 w-[11px] rounded-sm bg-white" />
              </div>
            </div>

            {/* Chapter markers */}
            <div className="relative h-6 mt-2">
              {ep.chapters.map((ch) => {
                const left = (ch.time / ep.duration) * 100;
                return (
                  <button
                    key={ch.label}
                    onClick={() => jumpTo(ch.time)}
                    className="absolute -translate-x-1/2 top-0 text-[9px] text-gray-400 hover:text-white whitespace-nowrap"
                    style={{ left: `${left}%` }}
                  >
                    <span className="block h-2 w-px bg-gray-600 mx-auto mb-0.5" />
                    {formatTime(ch.time)} {ch.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Controls */}
          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={() => skip(-15)}
              className="h-9 w-9 rounded-full border border-white/15 text-gray-300 hover:text-white hover:border-white/30 flex items-center justify-center"
              title="Back 15s"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                <path d="M9.195 18.44c1.25.714 2.805-.189 2.805-1.629v-2.34l6.945 3.968c1.25.714 2.805-.188 2.805-1.628V8.689c0-1.44-1.555-2.342-2.805-1.628L12 11.029V8.689c0-1.44-1.555-2.342-2.805-1.628l-7.108 4.061c-1.26.72-1.26 2.536 0 3.256l7.108 4.061Z" />
              </svg>
            </button>

            <button
              onClick={() => setPlaying((p) => !p)}
              className="h-12 w-12 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-500 transition"
              aria-label={playing ? "Pause" : "Play"}
            >
              {playing ? (
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1-.75-.75V5.25Z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 ml-0.5">
                  <path d="M8.25 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286l-11.54 6.347c-1.25.687-2.779-.217-2.779-1.643V5.653Z" />
                </svg>
              )}
            </button>

            <button
              onClick={() => skip(15)}
              className="h-9 w-9 rounded-full border border-white/15 text-gray-300 hover:text-white hover:border-white/30 flex items-center justify-center"
              title="Forward 15s"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                <path d="M5.055 7.06c-1.25-.714-2.805.189-2.805 1.628v5.12c0 1.44 1.555 2.342 2.805 1.628l7.108-4.061c1.26-.72 1.26-2.536 0-3.256L5.055 7.06Z" />
                <path d="M12 7.06c-1.25-.714-2.805.189-2.805 1.628v5.12c0 1.44 1.555 2.342 2.805 1.628l7.108-4.061c1.26-.72 1.26-2.536 0-3.256L12 7.06Z" />
              </svg>
            </button>

            <span className="ml-2 text-[10px] font-mono text-gray-500">FLAC · 320kbps</span>

            <div className="ml-auto flex items-center gap-1">
              {[1, 1.25, 1.5].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-2 py-1 rounded-sm text-[11px] font-semibold border ${
                    speed === s ? "border-red-500 text-red-400" : "border-white/15 text-gray-400 hover:text-white"
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>

            <button
              onClick={() => setSaved((v) => !v)}
              className={`p-2 rounded-sm border ${saved ? "border-amber-400 text-amber-400" : "border-white/15 text-gray-400 hover:text-white"}`}
              title="Save"
            >
              <svg viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right: synchronized transcript */}
        <div className="flex flex-col bg-[#131419]">
          <div className="flex flex-wrap items-center gap-2 px-4 py-3 border-b border-white/10">
            <div className="flex rounded-sm border border-white/15 overflow-hidden text-[11px] font-semibold">
              <button
                onClick={() => setView("transcript")}
                className={`px-3 py-1.5 ${view === "transcript" ? "bg-white/15 text-white" : "text-gray-400 hover:text-white"}`}
              >
                Transcript
              </button>
              <button
                onClick={() => setView("takeaways")}
                className={`px-3 py-1.5 ${view === "takeaways" ? "bg-white/15 text-white" : "text-gray-400 hover:text-white"}`}
              >
                Takeaways
              </button>
            </div>

            <button
              onClick={() => setSync((v) => !v)}
              className={`px-2 py-1 rounded-sm text-[11px] font-semibold border ${
                sync ? "border-emerald-400/50 text-emerald-400" : "border-white/15 text-gray-500"
              }`}
              title="Toggle live audio sync"
            >
              {sync ? "SYNC ON" : "SYNC OFF"}
            </button>

            <div className="ml-auto flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="h-4 w-4 text-gray-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search verbatim…"
                className="w-32 sm:w-44 rounded-sm bg-white/5 border border-white/10 px-2.5 py-1.5 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-white/30"
              />
            </div>
          </div>

          <div className="flex-1 px-4 py-4 max-h-[480px] overflow-y-auto">
            {view === "transcript" ? (
              <ol className="space-y-3">
                {visibleTranscript.map((s) => {
                  const active = activeSegment?.start === s.start;
                  return (
                    <li
                      key={s.start}
                      id={`seg-${s.start}`}
                      className={`rounded-sm border p-3 transition ${
                        active
                          ? "border-amber-400/40 bg-amber-400/5"
                          : "border-transparent hover:border-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => jumpTo(s.start)}
                          className="font-mono text-xs text-red-400 hover:underline tabular-nums"
                        >
                          {formatTime(s.start)}
                        </button>
                        <span className="text-xs font-semibold text-white">{s.speaker}</span>
                        <span className="text-[10px] text-gray-500">{s.role}</span>
                        {active && (
                          <span className="ml-auto flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-amber-400">
                            <span className="flex items-end gap-[1px] h-3">
                              {[3, 5, 4, 6, 3].map((h, i) => (
                                <span key={i} className="w-[2px] bg-amber-400 animate-pulse" style={{ height: `${h * 3}px`, animationDelay: `${i * 100}ms` }} />
                              ))}
                            </span>
                            Now speaking
                          </span>
                        )}
                      </div>
                      <p className="mt-1 font-serif text-[15px] leading-relaxed text-gray-200">{s.text}</p>

                      {active && (
                        <div className="mt-2 flex items-center gap-1.5">
                          <button onClick={() => clipShare(s)} className="px-2 py-1 rounded-sm bg-white/5 border border-white/10 text-[10px] font-semibold text-gray-300 hover:text-white">
                            Clip &amp; Share
                          </button>
                          <button onClick={() => copyTimestamp(s)} className="px-2 py-1 rounded-sm bg-white/5 border border-white/10 text-[10px] font-semibold text-gray-300 hover:text-white">
                            Copy timestamp
                          </button>
                          <button onClick={() => setSaved((v) => !v)} className="px-2 py-1 rounded-sm bg-white/5 border border-white/10 text-[10px] font-semibold text-gray-300 hover:text-white">
                            Bookmark
                          </button>
                        </div>
                      )}
                    </li>
                  );
                })}
                {visibleTranscript.length === 0 && (
                  <p className="text-sm text-gray-500">No matching transcript segments.</p>
                )}
              </ol>
            ) : (
              <ul className="space-y-3">
                {ep.takeaways.map((t, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="shrink-0 h-6 w-6 rounded-full bg-white/5 border border-white/10 text-red-400 flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </span>
                    <p className="font-serif text-[15px] leading-relaxed text-gray-200">{t}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex items-center gap-3 px-4 py-3 border-t border-white/10 text-[11px] text-gray-500">
            <span className="inline-flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5 text-emerald-500">
                <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497A4.49 4.49 0 0 1 8.603 3.799Zm7.564 5.423a.75.75 0 0 0-1.06-1.06l-4.357 4.357-1.886-1.886a.75.75 0 1 0-1.06 1.06l2.416 2.417a.75.75 0 0 0 1.06 0l4.887-4.888Z" clipRule="evenodd" />
              </svg>
              Court-reporter certified transcript
            </span>
            <a href="#" className="ml-auto text-red-400 hover:text-red-300 font-semibold">
              Download .PDF master transcript
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
