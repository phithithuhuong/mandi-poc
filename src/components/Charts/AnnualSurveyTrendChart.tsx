"use client";

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { useMemo } from "react";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface SurveyTrendRow {
  label: string;
  good: number;
  mediumRisk: number;
  highRisk: number;
  noAnswer: number;
}

const SURVEY_TREND_DATA: SurveyTrendRow[] = [
  { label: "2025年度第1回", good: 85, mediumRisk: 6, highRisk: 6, noAnswer: 3 },
  { label: "2025年度第2回", good: 80, mediumRisk: 11, highRisk: 5, noAnswer: 4 },
  { label: "2025年度第3回", good: 87, mediumRisk: 6, highRisk: 4, noAnswer: 3 },
  { label: "2025年度第4回", good: 85, mediumRisk: 6, highRisk: 6, noAnswer: 3 },
  { label: "2025年度第5回", good: 80, mediumRisk: 11, highRisk: 5, noAnswer: 4 },
  { label: "2025年度第6回", good: 86, mediumRisk: 6, highRisk: 4, noAnswer: 4 },
  { label: "2025年度第7回", good: 84, mediumRisk: 7, highRisk: 6, noAnswer: 3 },
  { label: "2025年度第8回", good: 79, mediumRisk: 11, highRisk: 5, noAnswer: 5 },
  { label: "2025年度第9回", good: 86, mediumRisk: 6, highRisk: 4, noAnswer: 4 },
  { label: "2025年度第10回", good: 84, mediumRisk: 7, highRisk: 5, noAnswer: 4 },
  { label: "2025年度第11回", good: 79, mediumRisk: 11, highRisk: 5, noAnswer: 5 },
  { label: "2025年度第12回", good: 86, mediumRisk: 6, highRisk: 4, noAnswer: 4 },
];

const AnnualSurveyTrendChart = () => {
  const data = useMemo(
    () => ({
      labels: SURVEY_TREND_DATA.map((row) => row.label),
      datasets: [
        {
          label: "良好",
          data: SURVEY_TREND_DATA.map((row) => row.good),
          backgroundColor: "#43aac7",
          stack: "distribution",
          borderRadius: { topLeft: 4, bottomLeft: 4 },
          borderSkipped: false as const,
          barThickness: 24,
        },
        {
          label: "中リスク",
          data: SURVEY_TREND_DATA.map((row) => row.mediumRisk),
          backgroundColor: "#e0a735",
          stack: "distribution",
          borderSkipped: false as const,
          barThickness: 24,
        },
        {
          label: "高リスク",
          data: SURVEY_TREND_DATA.map((row) => row.highRisk),
          backgroundColor: "#e23c3c",
          stack: "distribution",
          borderSkipped: false as const,
          barThickness: 24,
        },
        {
          label: "無回答",
          data: SURVEY_TREND_DATA.map((row) => row.noAnswer),
          backgroundColor: "#d9d9d9",
          stack: "distribution",
          borderRadius: { topRight: 4, bottomRight: 4 },
          borderSkipped: false as const,
          barThickness: 24,
        },
      ],
    }),
    [],
  );

  const options: ChartOptions<"bar"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: "y",
      animation: {
        duration: 900,
        easing: "easeOutQuart",
      },
      transitions: {
        active: {
          animation: {
            duration: 0,
          },
        },
      },
      animations: {
        x: {
          from: 0,
        },
      },
      layout: {
        padding: {
          top: 4,
          right: 8,
          bottom: 4,
          left: 0,
        },
      },
      interaction: {
        mode: "index",
        axis: "y",
        intersect: true,
      },
      hover: {
        mode: "index",
        axis: "y",
        intersect: true,
      },
      onHover(event, elements) {
        const target = event.native?.target as HTMLCanvasElement | undefined;
        if (!target) {
          return;
        }
        target.style.cursor = elements.length > 0 ? "pointer" : "default";
      },
      scales: {
        x: {
          min: 0,
          max: 100,
          stacked: true,
          position: "top",
          grid: {
            display: false,
          },
          border: {
            display: false,
          },
          ticks: {
            stepSize: 25,
            color: "#4b5563",
            font: {
              size: 12,
              weight: 600,
            },
            callback(value) {
              return `${value}%`;
            },
          },
        },
        y: {
          stacked: true,
          grid: {
            display: false,
            drawBorder: false,
          },
          border: {
            display: false,
          },
          ticks: {
            color: "#374151",
            font: {
              size: 12,
            },
          },
        },
      },
      plugins: {
        legend: {
          position: "top",
          align: "end",
          labels: {
            boxWidth: 10,
            boxHeight: 10,
            color: "#374151",
            padding: 12,
          },
        },
        tooltip: {
          backgroundColor: "rgba(31, 41, 55, 0.95)",
          titleColor: "#f9fafb",
          bodyColor: "#e5e7eb",
          padding: 10,
          cornerRadius: 8,
          displayColors: true,
          callbacks: {
            title(context) {
              return context[0]?.label ?? "";
            },
            label(context) {
              const label = context.dataset.label ?? "";
              const value = Number(context.raw);
              return `${label}  ${value}%`;
            },
          },
        },
      },
    }),
    [],
  );

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h1 className="text-base font-semibold text-slate-800">2025年度のアンケート結果推移（全12回開催）</h1>
          <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-slate-400 text-[10px] text-slate-500">
            ?
          </span>
        </div>
      </div>

      <div className="h-[560px] w-full min-w-0">
        <Bar data={data} options={options} />
      </div>
    </section>
  );
};

export default AnnualSurveyTrendChart;
