"use client";

import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ChartOptions,
  Plugin,
} from "chart.js";
import { Scatter } from "react-chartjs-2";
import annotationPlugin, { AnnotationOptions } from "chartjs-plugin-annotation";
import { useMemo } from "react";
import {
  AggregateScatterPoint,
  clampScatterPosition,
  GRADE_TO_Y,
  MOCK_AGGREGATE_POINTS,
  MOCK_STUDENT_POINTS,
  SPCE_MIDPOINT,
  StudentScatterPoint,
  WELLBEING_GRADES,
  WELLBEING_MIDLINE,
} from "./wellbeingScatterUtils";

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend, annotationPlugin);

type ChartVariant = "individual" | "aggregate";

interface WellbeingScatterChartProps {
  variant: ChartVariant;
  studentPoints?: StudentScatterPoint[];
  aggregatePoints?: AggregateScatterPoint[];
}

const axisTitlePlugin: Plugin<"scatter"> = {
  id: "axisTitlePlugin",
  afterDraw(chart) {
    const { ctx, chartArea, scales } = chart;
    if (!chartArea) return;

    const xScale = scales.x;
    const yScale = scales.y;
    if (!xScale || !yScale) return;

    const axisLineX = xScale.getPixelForValue(SPCE_MIDPOINT);
    const axisLineY = yScale.getPixelForValue(WELLBEING_MIDLINE);

    ctx.save();
    ctx.fillStyle = "#333";
    ctx.font = "12px sans-serif";

    ctx.textAlign = "left";
    ctx.textBaseline = "bottom";
    ctx.fillText("社会的保護要因 (S-PCE14)", chartArea.left, axisLineY - 6);

    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText("ウェルビーイング (WHO-5)", axisLineX, chartArea.top - 4);

    ctx.restore();
  },
};

const LABEL_HALF_HEIGHT = 7;
const NUMBER_ROW_OFFSET = 4;
const NUMBER_ROW_HEIGHT = 14;

const drawLineSegments = (
  ctx: CanvasRenderingContext2D,
  x: number,
  yStart: number,
  yEnd: number,
  gaps: { top: number; bottom: number }[],
) => {
  let currentY = yStart;

  gaps.forEach((gap) => {
    if (gap.top > currentY) {
      ctx.beginPath();
      ctx.moveTo(x, currentY);
      ctx.lineTo(x, gap.top);
      ctx.stroke();
    }
    currentY = Math.max(currentY, gap.bottom);
  });

  if (currentY < yEnd) {
    ctx.beginPath();
    ctx.moveTo(x, currentY);
    ctx.lineTo(x, yEnd);
    ctx.stroke();
  }
};

const drawAxisCrosshair = (
  chart: ChartJS<"scatter">,
  ctx: CanvasRenderingContext2D,
) => {
  const { scales, chartArea } = chart;
  const xScale = scales.x;
  const yScale = scales.y;
  if (!xScale || !yScale || !chartArea) return;

  const axisLineX = xScale.getPixelForValue(SPCE_MIDPOINT);
  const axisLineY = yScale.getPixelForValue(WELLBEING_MIDLINE);
  const numberRowY = axisLineY + NUMBER_ROW_OFFSET;

  ctx.save();
  ctx.font = "13px sans-serif";

  const gradeGaps = WELLBEING_GRADES.map((grade) => {
    const y = yScale.getPixelForValue(GRADE_TO_Y[grade]);
    const metrics = ctx.measureText(grade);
    const halfH =
      (metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent) / 2 || LABEL_HALF_HEIGHT;
    return { top: y - halfH - 1, bottom: y + halfH + 1 };
  });

  gradeGaps.push({ top: numberRowY - 2, bottom: numberRowY + NUMBER_ROW_HEIGHT });

  const sevenHalfWidth = ctx.measureText("7").width / 2 + 1;
  const verticalGaps = gradeGaps.sort((a, b) => a.top - b.top);

  ctx.strokeStyle = "#555";
  ctx.lineWidth = 1.5;

  drawLineSegments(ctx, axisLineX, chartArea.top, chartArea.bottom, verticalGaps);

  ctx.beginPath();
  ctx.moveTo(chartArea.left, axisLineY);
  ctx.lineTo(axisLineX - sevenHalfWidth, axisLineY);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(axisLineX + sevenHalfWidth, axisLineY);
  ctx.lineTo(chartArea.right, axisLineY);
  ctx.stroke();

  ctx.restore();
};

const axisCrosshairPlugin: Plugin<"scatter"> = {
  id: "axisCrosshairPlugin",
  afterDatasetsDraw(chart) {
    drawAxisCrosshair(chart, chart.ctx);
  },
};

const axisTickLabelsPlugin: Plugin<"scatter"> = {
  id: "axisTickLabelsPlugin",
  afterDraw(chart) {
    const { ctx, scales } = chart;
    const xScale = scales.x;
    const yScale = scales.y;
    if (!xScale || !yScale) return;

    const axisLineX = xScale.getPixelForValue(SPCE_MIDPOINT);
    const axisLineY = yScale.getPixelForValue(WELLBEING_MIDLINE);

    ctx.save();
    ctx.fillStyle = "#444";
    ctx.font = "13px sans-serif";

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    WELLBEING_GRADES.forEach((grade) => {
      const y = yScale.getPixelForValue(GRADE_TO_Y[grade]);
      ctx.fillText(grade, axisLineX, y);
    });

    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    for (let i = 0; i <= 14; i += 1) {
      const x = xScale.getPixelForValue(i);
      ctx.fillText(String(i), x, axisLineY + NUMBER_ROW_OFFSET);
    }

    ctx.restore();
  },
};

const buildBaseAnnotations = (showHighlightBox: boolean): Record<string, AnnotationOptions> => {
  const annotations: Record<string, AnnotationOptions> = {
    dBand: {
      type: "box",
      yMin: -0.5,
      yMax: 0.5,
      xMin: 0,
      xMax: 14,
      backgroundColor: "rgba(255, 192, 192, 0.45)",
      borderWidth: 0,
    },
  };

  if (showHighlightBox) {
    annotations.highlightBox = {
      type: "box",
      xMin: SPCE_MIDPOINT,
      xMax: 14,
      yMin: WELLBEING_MIDLINE,
      yMax: 3.5,
      backgroundColor: "rgba(173, 216, 230, 0.35)",
      borderWidth: 0,
    };
  }

  return annotations;
};

const WellbeingScatterChart = ({
  variant,
  studentPoints = MOCK_STUDENT_POINTS,
  aggregatePoints = MOCK_AGGREGATE_POINTS,
}: WellbeingScatterChartProps) => {
  const isIndividual = variant === "individual";
  const points = isIndividual ? studentPoints : aggregatePoints;

  const clampPoints = <T extends { x: number; y: number }>(items: T[]) =>
    items.map((point) => {
      const { x, y } = clampScatterPosition(point.x, point.y);
      return { ...point, x, y };
    });

  const { bluePoints, redPoints } = useMemo(() => {
    const blue = clampPoints(points.filter((p) => !p.isHighlight));
    const red = clampPoints(points.filter((p) => p.isHighlight));
    return { bluePoints: blue, redPoints: red };
  }, [points]);

  const data = useMemo(
    () => ({
      datasets: [
        {
          label: "通常",
          data: bluePoints,
          backgroundColor: "#2563eb",
          pointRadius: 5,
          clip: 8,
          pointHoverRadius: 7,
          pointHoverBorderWidth: 2,
          pointHoverBorderColor: "#ffffff",
        },
        {
          label: "要注意",
          data: redPoints,
          backgroundColor: "#dc2626",
          pointRadius: 5,
          clip: 8,
          pointHoverRadius: 7,
          pointHoverBorderWidth: 2,
          pointHoverBorderColor: "#ffffff",
        },
      ],
    }),
    [bluePoints, redPoints],
  );

  const options: ChartOptions<"scatter"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: { top: 28, right: 12, bottom: 12, left: 12 },
      },
      plugins: {
        legend: { display: false },
        annotation: {
          annotations: buildBaseAnnotations(!isIndividual),
        },
        tooltip: {
          backgroundColor: "rgba(255, 255, 255, 0.97)",
          titleColor: "#1e3a5f",
          bodyColor: "#333",
          borderColor: "#91c6f4",
          borderWidth: 2,
          padding: 12,
          displayColors: false,
          callbacks: {
            title(context) {
              const raw = context[0]?.raw as StudentScatterPoint | AggregateScatterPoint;
              if (isIndividual) {
                return (raw as StudentScatterPoint).studentLabel ?? "";
              }
              return (raw as AggregateScatterPoint).typeLabel ?? "";
            },
            label(context) {
              const raw = context.raw as StudentScatterPoint | AggregateScatterPoint;
              if (isIndividual) {
                const student = raw as StudentScatterPoint;
                return [
                  student.typeLabel,
                  `ウェルビーイング：${student.wellbeing}`,
                  `社会的保護要因：${student.spce}`,
                ];
              }
              const aggregate = raw as AggregateScatterPoint;
              return [`${aggregate.count}名 (${aggregate.percentage}%)`];
            },
          },
        },
      },
      scales: {
        x: {
          type: "linear",
          min: 0,
          max: 14,
          afterBuildTicks(axis) {
            axis.ticks = Array.from({ length: 15 }, (_, i) => ({ value: i }));
          },
          ticks: {
            display: false,
          },
          grid: {
            display: false,
          },
          border: {
            display: false,
          },
        },
        y: {
          type: "linear",
          min: -0.5,
          max: 3.5,
          afterBuildTicks(axis) {
            axis.ticks = [0, 1, 2, 3].map((value) => ({ value }));
          },
          ticks: {
            display: false,
          },
          grid: {
            display: false,
          },
          border: {
            display: false,
          },
        },
      },
    }),
    [isIndividual],
  );

  return (
    <div className="h-[480px] w-full min-w-0">
      <Scatter
        data={data}
        options={options}
        plugins={[axisCrosshairPlugin, axisTickLabelsPlugin, axisTitlePlugin]}
      />
    </div>
  );
};

export default WellbeingScatterChart;
