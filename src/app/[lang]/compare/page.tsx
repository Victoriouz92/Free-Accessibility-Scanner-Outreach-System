"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

/**
 * Competitor Comparison Page
 * Scan 2 URLs side by side and compare accessibility scores.
 */

interface ScanResult {
  url: string;
  score: number;
  issues: { critical: number; serious: number; moderate: number; minor: number };
}

const t = {
  en: {
    heading: "Compare Two Websites",
    subtitle: "See how your site stacks up against a competitor on accessibility.",
    yourWebsite: "Your website",
    competitor: "Competitor",
    scanning: "Scanning both sites...",
    compareButton: "Compare accessibility",
    scanFailed: "Comparison failed",
    scanTimedOut: "Scan timed out",
    results: "Results",
    critical: "critical",
    serious: "serious",
    moderate: "moderate",
    yourSiteWins: "Your site is more accessible! Keep it up.",
    competitorWins: "Your competitor is ahead on accessibility. Time to catch up?",
    tie: "Both sites have the same score. There's room to stand out!",
    getHelp: "Get help improving your score →",
  },
  bg: {
    heading: "Сравнете два уебсайта",
    subtitle: "Вижте как вашият сайт се справя спрямо конкурент по отношение на достъпността.",
    yourWebsite: "Вашият уебсайт",
    competitor: "Конкурент",
    scanning: "Сканиране на двата сайта...",
    compareButton: "Сравни достъпността",
    scanFailed: "Сравнението неуспешно",
    scanTimedOut: "Изтече времето за сканиране",
    results: "Резултати",
    critical: "критични",
    serious: "сериозни",
    moderate: "умерени",
    yourSiteWins: "Вашият сайт е по-достъпен! Продължавайте така.",
    competitorWins: "Конкурентът ви е напред по достъпност. Време е да наваксате?",
    tie: "И двата сайта имат еднакъв резултат. Има място да се откроите!",
    getHelp: "Получете помощ за подобряване на резултата →",
  },
};

export default function ComparePage() {
  const params = useParams();
  const lang = params.lang as string;
  const dict = lang === "bg" ? t.bg : t.en;

  const [url1, setUrl1] = useState("");
  const [url2, setUrl2] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<[ScanResult | null, ScanResult | null]>([null, null]);
  const [error, setError] = useState("");

  async function handleCompare(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResults([null, null]);
    setLoading(true);

    const normalize = (u: string) => u.trim().startsWith("http") ? u.trim() : "https://" + u.trim();

    try {
      const [res1, res2] = await Promise.all([
        fetch("/api/scan", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: normalize(url1), nocache: true }) }),
        fetch("/api/scan", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: normalize(url2), nocache: true }) }),
      ]);

      const data1 = await res1.json();
      const data2 = await res2.json();

      // Poll both until complete
      const poll = async (scanId: string): Promise<ScanResult> => {
        for (let i = 0; i < 30; i++) {
          await new Promise(r => setTimeout(r, 2000));
          const res = await fetch(`/api/scan/${scanId}`);
          const data = await res.json();
          if (data.status === "complete") return data.result;
          if (data.status === "error") throw new Error(data.error);
        }
        throw new Error(dict.scanTimedOut);
      };

      const [result1, result2] = await Promise.all([
        data1.status === "complete" ? fetchResult(data1.scanId) : poll(data1.scanId),
        data2.status === "complete" ? fetchResult(data2.scanId) : poll(data2.scanId),
      ]);

      setResults([result1, result2]);
    } catch (err: any) {
      setError(err.message || dict.scanFailed);
    } finally {
      setLoading(false);
    }
  }

  async function fetchResult(scanId: string): Promise<ScanResult> {
    const res = await fetch(`/api/scan/${scanId}`);
    const data = await res.json();
    return data.result;
  }

  const scoreColor = (s: number) => s >= 80 ? "text-primary" : s >= 50 ? "text-moderate" : "text-critical";

  return (
    <section className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-2">{dict.heading}</h1>
      <p className="text-muted mb-8">{dict.subtitle}</p>

      <form onSubmit={handleCompare} className="space-y-4 mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="url1" className="block text-sm font-medium mb-1">{dict.yourWebsite}</label>
            <input id="url1" type="text" value={url1} onChange={e => setUrl1(e.target.value)} placeholder="yoursite.com" className="w-full px-4 py-3 rounded-lg border border-border bg-surface" disabled={loading} />
          </div>
          <div>
            <label htmlFor="url2" className="block text-sm font-medium mb-1">{dict.competitor}</label>
            <input id="url2" type="text" value={url2} onChange={e => setUrl2(e.target.value)} placeholder="competitor.com" className="w-full px-4 py-3 rounded-lg border border-border bg-surface" disabled={loading} />
          </div>
        </div>
        <button type="submit" disabled={loading || !url1.trim() || !url2.trim()} className="w-full sm:w-auto px-8 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary-hover disabled:opacity-50 transition-colors">
          {loading ? dict.scanning : dict.compareButton}
        </button>
      </form>

      {error && <div className="bg-critical/8 border border-critical/25 rounded-lg p-4 mb-6 text-critical text-sm">{error}</div>}

      {results[0] && results[1] && (
        <div className="bg-surface rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold mb-6 text-center">{dict.results}</h2>
          <div className="grid grid-cols-2 gap-8 text-center">
            {/* Site 1 */}
            <div>
              <p className="text-xs text-muted mb-2 truncate">{results[0].url}</p>
              <p className={`text-5xl font-bold ${scoreColor(results[0].score)}`}>{results[0].score}</p>
              <p className="text-sm text-muted mt-1">/100</p>
              <div className="mt-4 text-xs space-y-1">
                <p><span className="text-critical font-semibold">{results[0].issues.critical}</span> {dict.critical}</p>
                <p><span className="text-serious font-semibold">{results[0].issues.serious}</span> {dict.serious}</p>
                <p><span className="text-moderate font-semibold">{results[0].issues.moderate}</span> {dict.moderate}</p>
              </div>
            </div>
            {/* Site 2 */}
            <div>
              <p className="text-xs text-muted mb-2 truncate">{results[1].url}</p>
              <p className={`text-5xl font-bold ${scoreColor(results[1].score)}`}>{results[1].score}</p>
              <p className="text-sm text-muted mt-1">/100</p>
              <div className="mt-4 text-xs space-y-1">
                <p><span className="text-critical font-semibold">{results[1].issues.critical}</span> {dict.critical}</p>
                <p><span className="text-serious font-semibold">{results[1].issues.serious}</span> {dict.serious}</p>
                <p><span className="text-moderate font-semibold">{results[1].issues.moderate}</span> {dict.moderate}</p>
              </div>
            </div>
          </div>

          {/* Winner banner */}
          <div className="mt-8 text-center p-4 bg-primary-light rounded-lg">
            {results[0].score > results[1].score ? (
              <p className="font-semibold text-primary">{dict.yourSiteWins}</p>
            ) : results[0].score < results[1].score ? (
              <p className="font-semibold text-critical">{dict.competitorWins}</p>
            ) : (
              <p className="font-semibold">{dict.tie}</p>
            )}
            <a href={`/${lang}/contact`} className="inline-block mt-3 text-sm text-primary underline">{dict.getHelp}</a>
          </div>
        </div>
      )}
    </section>
  );
}
