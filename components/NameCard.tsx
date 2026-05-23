"use client";

import { NameAnalysis } from "@/app/page";

const PART_CONFIG = {
  first: {
    label: "First Name",
    accent: "from-violet-600 to-indigo-600",
    glow: "rgba(124,58,237,0.2)",
    badge: "bg-violet-500/20 text-violet-300 border-violet-500/30",
    dot: "#7c3aed",
  },
  middle: {
    label: "Middle Name",
    accent: "from-sky-500 to-cyan-500",
    glow: "rgba(14,165,233,0.2)",
    badge: "bg-sky-500/20 text-sky-300 border-sky-500/30",
    dot: "#0ea5e9",
  },
  last: {
    label: "Last Name",
    accent: "from-emerald-500 to-teal-500",
    glow: "rgba(16,185,129,0.2)",
    badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    dot: "#10b981",
  },
} as const;

interface Props {
  analysis: NameAnalysis;
  index: number;
}

export default function NameCard({ analysis, index }: Props) {
  const cfg = PART_CONFIG[analysis.part] ?? PART_CONFIG.first;

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        animation: `fadeUp 0.45s ease-out ${index * 0.12}s both`,
        boxShadow: `0 0 40px ${cfg.glow}, 0 2px 8px rgba(0,0,0,0.4)`,
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Top gradient bar */}
      <div className={`h-1 w-full bg-gradient-to-r ${cfg.accent}`} />

      <div className="glass p-6">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <span
              className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border mb-3 ${cfg.badge}`}
            >
              {cfg.label}
            </span>
            <h2
              className="text-4xl font-bold tracking-wide"
              style={{
                fontFamily: "Georgia, serif",
                background: `linear-gradient(135deg, #ffffff, #c4b5fd)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {analysis.name}
            </h2>
          </div>
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 mt-1"
            style={{ background: cfg.glow, border: `1px solid ${cfg.dot}33` }}
          >
            {analysis.part === "first" ? "👤" : analysis.part === "middle" ? "✦" : "🏛️"}
          </div>
        </div>

        {/* Origin pill */}
        <div className="inline-flex items-center gap-2 mb-5 text-sm text-slate-300 bg-white/5 rounded-full px-4 py-1.5 border border-white/8">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: cfg.dot }}
          />
          {analysis.origin}
        </div>

        {/* Meaning */}
        <Section title="Meaning">
          <p className="text-slate-300 leading-relaxed">{analysis.meaning}</p>
        </Section>

        {/* Etymology */}
        <Section title="Etymology">
          <p className="text-slate-300 leading-relaxed">{analysis.etymology}</p>
        </Section>

        {/* Two-column: Traits + Notable Bearers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
          <Section title="Personality Traits">
            <div className="flex flex-wrap gap-2 mt-1">
              {(analysis.traits ?? []).map((trait) => (
                <span
                  key={trait}
                  className="text-xs px-3 py-1 rounded-full border text-slate-300"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    borderColor: "rgba(255,255,255,0.1)",
                  }}
                >
                  {trait}
                </span>
              ))}
            </div>
          </Section>

          <Section title="Notable Bearers">
            <ul className="mt-1 space-y-1">
              {(analysis.notableBearers ?? []).map((person) => (
                <li key={person} className="flex items-center gap-2 text-sm text-slate-300">
                  <span style={{ color: cfg.dot }}>›</span>
                  {person}
                </li>
              ))}
            </ul>
          </Section>
        </div>

        {/* Fun fact */}
        {analysis.funFact && (
          <div
            className="mt-5 rounded-xl p-4 text-sm text-slate-300 leading-relaxed"
            style={{
              background: `linear-gradient(135deg, ${cfg.glow}, rgba(255,255,255,0.02))`,
              border: `1px solid ${cfg.dot}22`,
            }}
          >
            <span className="mr-2">💡</span>
            <span className="font-semibold text-white">Fun fact: </span>
            {analysis.funFact}
          </div>
        )}
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-5 first:mt-0">
      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
        {title}
      </h3>
      {children}
    </div>
  );
}
