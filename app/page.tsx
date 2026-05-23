"use client";

import { useState, FormEvent } from "react";
import NameCard from "@/components/NameCard";
import LoadingCard from "@/components/LoadingCard";

export interface NameAnalysis {
  part: "first" | "middle" | "last";
  name: string;
  meaning: string;
  etymology: string;
  origin: string;
  traits: string[];
  notableBearers: string[];
  funFact: string;
}

export default function Home() {
  const [inputName, setInputName] = useState("");
  const [analyses, setAnalyses] = useState<NameAnalysis[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedName, setSubmittedName] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = inputName.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    setAnalyses([]);
    setSubmittedName(trimmed);

    try {
      const res = await fetch("/api/name-meaning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        if (body.code === "NO_CREDENTIALS") {
          throw new Error("__CREDENTIALS__");
        }
        throw new Error(body.error || "Failed to analyze name");
      }

      const data = await res.json();
      setAnalyses(data.analyses);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120,80,255,0.15) 0%, transparent 60%), #07071a",
      }}
    >
      {/* Header */}
      <header className="pt-12 pb-6 text-center px-4">
        <div className="inline-flex items-center gap-3 mb-4">
          <span className="text-4xl select-none">✦</span>
          <h1
            className="text-5xl font-bold tracking-tight text-gradient"
            style={{ fontFamily: "Georgia, serif" }}
          >
            NamesPlay
          </h1>
          <span className="text-4xl select-none">✦</span>
        </div>
        <p className="text-slate-400 text-lg max-w-md mx-auto leading-relaxed">
          Discover the etymology, cultural roots, and hidden story behind every
          name.
        </p>
      </header>

      {/* Search section */}
      <main className="px-4 pb-24">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="glass-strong rounded-2xl p-6 shadow-2xl">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
              Enter a full name
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                placeholder="e.g. John Michael Smith"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-slate-500 text-lg focus:outline-none focus:border-violet-500/60 focus:bg-white/8 transition-all"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !inputName.trim()}
                className="px-6 py-4 rounded-xl font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background:
                    "linear-gradient(135deg, #7c3aed, #2563eb)",
                  boxShadow: "0 0 24px rgba(124,58,237,0.35)",
                }}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    Analyzing…
                  </span>
                ) : (
                  "Discover"
                )}
              </button>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Works with first name only, first + last, or full name (first middle last)
            </p>
          </form>

          {/* Error */}
          {error && (
            error === "__CREDENTIALS__" ? (
              <div className="mt-6 glass rounded-xl p-5 border border-amber-500/25 text-sm">
                <p className="text-amber-400 font-semibold mb-2">⚙ AWS credentials not configured</p>
                <p className="text-slate-400 leading-relaxed mb-3">
                  NamesPlay needs AWS credentials to reach Amazon Bedrock. Add these in the{" "}
                  <span className="text-white">Amplify Console → Hosting → Environment variables</span>, then redeploy:
                </p>
                <ul className="space-y-1 font-mono text-xs text-slate-300">
                  <li><span className="text-amber-400">APP_REGION</span> = us-east-1</li>
                  <li><span className="text-amber-400">APP_ACCESS_KEY_ID</span> = your key</li>
                  <li><span className="text-amber-400">APP_SECRET_ACCESS_KEY</span> = your secret</li>
                </ul>
              </div>
            ) : (
              <div className="mt-6 glass rounded-xl p-4 border border-red-500/20 text-red-400 text-sm">
                ⚠ {error}
              </div>
            )
          )}

          {/* Loading skeleton */}
          {loading && (
            <div className="mt-10 space-y-6">
              {[0, 1].map((i) => (
                <LoadingCard key={i} />
              ))}
            </div>
          )}

          {/* Results */}
          {!loading && analyses.length > 0 && (
            <section className="mt-10">
              <p className="text-slate-400 text-sm mb-6 text-center">
                Showing analysis for{" "}
                <span className="text-white font-semibold">{submittedName}</span>
              </p>
              <div className="space-y-6">
                {analyses.map((analysis, idx) => (
                  <NameCard key={`${analysis.name}-${idx}`} analysis={analysis} index={idx} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center pb-8 text-slate-600 text-xs">
        Powered by Amazon Bedrock · Nova Pro
      </footer>
    </div>
  );
}
