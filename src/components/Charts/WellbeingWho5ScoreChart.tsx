"use client";

import {
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { useMemo } from "react";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

type WellbeingGrade = "A" | "B" | "C" | "D";
type WellbeingStatus = "非常に良好" | "安定" | "注意" | "要フォロー";

interface WellbeingTrendPoint {
  round: number;
  date: string;
  level: number;
  status: WellbeingStatus;
  score: number;
}

const WHO5_MAX_SCORE = 15;

const Y_TO_GRADE: Record<number, WellbeingGrade> = {
  3: "A",
  2: "B",
  1: "C",
  0: "D",
};

const STATUS_COLOR: Record<WellbeingStatus, string> = {
  非常に良好: "#0ea5e9",
  安定: "#22c55e",
  注意: "#d97706",
  要フォロー: "#dc2626",
};

const TREND_POINTS: WellbeingTrendPoint[] = [
  { round: 1, date: "2025.06.01", level: 0.7, status: "注意", score: 6 },
  { round: 2, date: "2025.07.01", level: 0.05, status: "要フォロー", score: 3 },
  { round: 3, date: "2025.08.01", level: 1.15, status: "安定", score: 7 },
  { round: 4, date: "2025.09.01", level: 1.55, status: "安定", score: 8 },
  { round: 5, date: "2025.10.01", level: 0.95, status: "注意", score: 6 },
  { round: 6, date: "2025.11.01", level: 2.0, status: "非常に良好", score: 10 },
  { round: 7, date: "2025.12.01", level: 1.55, status: "安定", score: 7 },
  { round: 8, date: "2026.01.01", level: 1.2, status: "安定", score: 7 },
  { round: 9, date: "2026.02.01", level: 1.35, status: "安定", score: 8 },
  { round: 10, date: "2026.03.01", level: 1.35, status: "安定", score: 8 },
  { round: 11, date: "2026.04.01", level: 1.9, status: "安定", score: 9 },
  { round: 12, date: "2026.05.01", level: 2.45, status: "非常に良好", score: 11 },
];

const getBandLabel = (level: number): string => {
  if (level >= 2.5) return "A";
  if (level >= 2) return "A-B";
  if (level >= 1.5) return "B";
  if (level >= 1) return "B-C";
  if (level >= 0.5) return "C";
  if (level >= 0) return "C-D";
  return "D";
};

const WellbeingWho5ScoreChart = () => {
  const labels = useMemo(
    () => TREND_POINTS.map((point) => [`第${point.round}回`, `(${point.date})`]),
    [],
  );

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "ウェルビーイング (WHO-5)",
          data: TREND_POINTS.map((point) => point.level),
          borderColor: "#9ca3af",
          borderWidth: 2,
          tension: 0,
          pointRadius: 6,
          pointHoverRadius: 8,
          pointHitRadius: 14,
          pointBorderWidth: 2,
          pointBorderColor: "#ffffff",
          pointBackgroundColor: TREND_POINTS.map((point) => STATUS_COLOR[point.status]),
        },
      ],
    }),
    [labels],
  );

  const options: ChartOptions<"line"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "nearest",
        intersect: true,
      },
      scales: {
        y: {
          min: -0.3,
          max: 3.3,
          ticks: {
            stepSize: 1,
            color: "#1f2937",
            font: {
              size: 14,
              weight: 600,
            },
            callback(value) {
              if (typeof value !== "number") {
                return "";
              }
              return Y_TO_GRADE[value] ?? "";
            },
          },
          grid: {
            display: false,
          },
          border: {
            display: false,
          },
        },
        x: {
          ticks: {
            color: "#374151",
            font: {
              size: 12,
            },
            maxRotation: 0,
            autoSkip: false,
            padding: 8,
          },
          grid: {
            display: false,
          },
          border: {
            display: false,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: "rgba(17, 24, 39, 0.95)",
          titleColor: "#f9fafb",
          bodyColor: "#e5e7eb",
          displayColors: false,
          cornerRadius: 8,
          padding: 10,
          callbacks: {
            title(context) {
              const point = TREND_POINTS[context[0]?.dataIndex ?? 0];
              return `${getBandLabel(point.level)}: ${point.status}`;
            },
            label(context) {
              const point = TREND_POINTS[context.dataIndex];
              const percent = ((point.score / WHO5_MAX_SCORE) * 100).toFixed(1);
              return `スコア: ${point.score}/${WHO5_MAX_SCORE}点 (${percent}%)`;
            },
          },
        },
      },
    }),
    [],
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="mb-5 space-y-1">
        <h1 className="text-lg font-semibold text-slate-900 md:text-lg">ウェルビーイング (WHO-5) スコア</h1>
      </div>

      <div className="h-[420px] w-full min-w-0">
        <Line data={data} options={options} />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-slate-600 md:text-sm">
        {Object.entries(STATUS_COLOR).map(([status, color]) => (
          <div key={status} className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
            <span>{status}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WellbeingWho5ScoreChart;
