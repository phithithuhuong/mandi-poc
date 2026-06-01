"use client";

import WellbeingScatterChart from "@/components/Charts/WellbeingScatterChart";
import { useState } from "react";

const SESSION_OPTIONS = {
  class: ["1年2組 - 2026年5月実施回", "1年2組 - 2025年11月実施回"],
  grade: ["1年全体 - 2026年5月実施回", "1年全体 - 2025年11月実施回"],
};

interface ChartPanelProps {
  sessionOptions: string[];
  variant: "individual" | "aggregate";
}

const ChartPanel = ({ sessionOptions, variant }: ChartPanelProps) => {
  const [session, setSession] = useState(sessionOptions[0]);

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span className="text-lg font-medium text-gray-800">結果</span>
        <select
          value={session}
          onChange={(e) => setSession(e.target.value)}
          className="min-w-[240px] rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue focus:outline-none"
        >
          {sessionOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <button
          type="button"
          aria-label="ヘルプ"
          className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-400 text-sm text-gray-600 hover:bg-gray-50"
        >
          ?
        </button>
      </div>
      <WellbeingScatterChart variant={variant} />
    </section>
  );
};

const Results = () => {
  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 py-6 lg:px-6">
      <h1 className="mb-6 text-2xl font-medium text-gray-800">アンケート結果</h1>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartPanel sessionOptions={SESSION_OPTIONS.class} variant="individual" />
        <ChartPanel sessionOptions={SESSION_OPTIONS.grade} variant="aggregate" />
      </div>
    </div>
  );
};

export default Results;
