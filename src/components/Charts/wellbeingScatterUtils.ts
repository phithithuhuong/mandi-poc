export type WellbeingGrade = "A" | "B" | "C" | "D";

export const WELLBEING_GRADES: WellbeingGrade[] = ["A", "B", "C", "D"];

export const GRADE_TO_Y: Record<WellbeingGrade, number> = {
  A: 3,
  B: 2,
  C: 1,
  D: 0,
};

export const Y_TO_GRADE: Record<number, WellbeingGrade> = {
  3: "A",
  2: "B",
  1: "C",
  0: "D",
};

export const SPCE_MIDPOINT = 7;
export const WELLBEING_MIDLINE = 1.5;

export const POINT_INSET_X = 0.4;
export const POINT_INSET_Y = 0.25;

export const clampScatterPosition = (x: number, y: number) => ({
  x: Math.min(Math.max(x, POINT_INSET_X), 14 - POINT_INSET_X),
  y: Math.min(Math.max(y, -0.5 + POINT_INSET_Y), 3.5 - POINT_INSET_Y),
});

export const jitterY = (grade: WellbeingGrade): number => {
  const base = GRADE_TO_Y[grade];
  return base + (Math.random() - 0.5) * 0.35;
};

export interface StudentScatterPoint {
  x: number;
  y: number;
  studentLabel: string;
  typeLabel: string;
  wellbeing: WellbeingGrade;
  spce: number;
  isHighlight?: boolean;
}

export interface AggregateScatterPoint {
  x: number;
  y: number;
  typeLabel: string;
  count: number;
  percentage: number;
  isHighlight?: boolean;
}

export const MOCK_STUDENT_POINTS = [
  { x: 10, y: GRADE_TO_Y.B, studentLabel: "3番 太田さくら", typeLabel: "I 【充実・安定タイプ】", wellbeing: "B", spce: 10 },
  { x: 11, y: GRADE_TO_Y.A, studentLabel: "5番 山田太郎", typeLabel: "I 【充実・安定タイプ】", wellbeing: "A", spce: 11 },
  { x: 9, y: GRADE_TO_Y.B, studentLabel: "12番 鈴木花子", typeLabel: "I 【充実・安定タイプ】", wellbeing: "B", spce: 9 },
  { x: 8, y: GRADE_TO_Y.C, studentLabel: "7番 佐藤健", typeLabel: "II 【要注意タイプ】", wellbeing: "C", spce: 8 },
  { x: 5, y: GRADE_TO_Y.C, studentLabel: "1番 田中一郎", typeLabel: "III 【支援必要タイプ】", wellbeing: "C", spce: 5, isHighlight: true },
  { x: 4, y: GRADE_TO_Y.D, studentLabel: "15番 高橋美咲", typeLabel: "IV 【要フォローアップ】", wellbeing: "D", spce: 4, isHighlight: true },
  { x: 12, y: GRADE_TO_Y.A, studentLabel: "8番 伊藤翔", typeLabel: "I 【充実・安定タイプ】", wellbeing: "A", spce: 12 },
  { x: 6, y: GRADE_TO_Y.B, studentLabel: "2番 渡辺結衣", typeLabel: "II 【要注意タイプ】", wellbeing: "B", spce: 6 },
  { x: 13, y: GRADE_TO_Y.A, studentLabel: "20番 中村蓮", typeLabel: "I 【充実・安定タイプ】", wellbeing: "A", spce: 13 },
  { x: 3, y: GRADE_TO_Y.D, studentLabel: "9番 小林陽菜", typeLabel: "IV 【要フォローアップ】", wellbeing: "D", spce: 3, isHighlight: true },
  { x: 7, y: GRADE_TO_Y.C, studentLabel: "4番 加藤真", typeLabel: "III 【支援必要タイプ】", wellbeing: "C", spce: 7 },
  { x: 11, y: GRADE_TO_Y.B, studentLabel: "18番 吉田優", typeLabel: "I 【充実・安定タイプ】", wellbeing: "B", spce: 11 },
  { x: 9, y: GRADE_TO_Y.A, studentLabel: "6番 松本彩", typeLabel: "I 【充実・安定タイプ】", wellbeing: "A", spce: 9 },
  { x: 2, y: GRADE_TO_Y.D, studentLabel: "14番 井上颯", typeLabel: "IV 【要フォローアップ】", wellbeing: "D", spce: 2, isHighlight: true },
  { x: 8, y: GRADE_TO_Y.B, studentLabel: "11番 木村遥", typeLabel: "II 【要注意タイプ】", wellbeing: "B", spce: 8 },
  { x: 10, y: GRADE_TO_Y.A, studentLabel: "16番 林大輔", typeLabel: "I 【充実・安定タイプ】", wellbeing: "A", spce: 10 },
  { x: 5, y: GRADE_TO_Y.D, studentLabel: "13番 清水愛", typeLabel: "IV 【要フォローアップ】", wellbeing: "D", spce: 5, isHighlight: true },
  { x: 12, y: GRADE_TO_Y.B, studentLabel: "19番 森田海斗", typeLabel: "I 【充実・安定タイプ】", wellbeing: "B", spce: 12 },
  { x: 6, y: GRADE_TO_Y.C, studentLabel: "10番 池田奈々", typeLabel: "III 【支援必要タイプ】", wellbeing: "C", spce: 6 },
  { x: 14, y: GRADE_TO_Y.A, studentLabel: "21番 橋本陸", typeLabel: "I 【充実・安定タイプ】", wellbeing: "A", spce: 14 },
].map((point) => ({
  ...point,
  y: point.y + (Math.random() - 0.5) * 0.3,
})) as StudentScatterPoint[];

const AGGREGATE_TYPE = {
  stable: { label: "I 【充実・安定タイプ】", count: 58, percentage: 30.2 },
  caution: { label: "II 【要注意タイプ】", count: 32, percentage: 16.7 },
  support: { label: "III 【支援必要タイプ】", count: 24, percentage: 12.5 },
  followUp: { label: "IV 【要フォローアップ】", count: 18, percentage: 9.4 },
} as const;

interface AggregateZone {
  count: number;
  xMin: number;
  xMax: number;
  gradeCycle: WellbeingGrade[];
  colorOffset: number;
}

const AGGREGATE_ZONES: AggregateZone[] = [
  { count: 44, xMin: 6, xMax: 14, gradeCycle: ["A", "B", "A", "B"], colorOffset: 0 },
  { count: 34, xMin: 2, xMax: 12, gradeCycle: ["B", "C", "B", "C"], colorOffset: 1 },
  { count: 30, xMin: 1, xMax: 13, gradeCycle: ["C", "D", "D", "C"], colorOffset: 0 },
];

const X_JITTER_PATTERN = [-0.22, -0.08, 0.08, 0.22];
const Y_JITTER_PATTERN = [-0.16, -0.08, 0, 0.08, 0.16];

const resolveAggregateType = (
  grade: WellbeingGrade,
  isHighlight: boolean,
): keyof typeof AGGREGATE_TYPE => {
  if (grade === "D") return "followUp";
  if (grade === "C") return isHighlight ? "support" : "caution";
  return "stable";
};

const createAggregateZonePoints = (zone: AggregateZone): AggregateScatterPoint[] => {
  const span = zone.xMax - zone.xMin + 1;

  return Array.from({ length: zone.count }, (_, index) => {
    const column = index % span;
    const row = Math.floor(index / span);
    const xBase = zone.xMin + column;
    const grade = zone.gradeCycle[(index + row) % zone.gradeCycle.length];
    const isHighlight = (column + row + zone.colorOffset) % 2 === 0;
    const type = resolveAggregateType(grade, isHighlight);
    const meta = AGGREGATE_TYPE[type];

    return {
      x: xBase + X_JITTER_PATTERN[(index + row * 2) % X_JITTER_PATTERN.length],
      y: GRADE_TO_Y[grade] + Y_JITTER_PATTERN[(index * 3 + row) % Y_JITTER_PATTERN.length],
      typeLabel: meta.label,
      count: meta.count,
      percentage: meta.percentage,
      isHighlight,
    };
  });
};

export const MOCK_AGGREGATE_POINTS: AggregateScatterPoint[] = AGGREGATE_ZONES.flatMap(
  createAggregateZonePoints,
);
