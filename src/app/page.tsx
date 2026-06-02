import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-3xl font-semibold text-gray-800"> Nicoli2 POC</h1>
      <p className="text-gray-600">Next.js scaffold copied from Nicoli2 OS structure.</p>
      <div className="flex flex-col items-center justify-center gap-3">
        <Link
          href="/results"
          className="w-[300px] rounded-md bg-blue px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-dark hover:text-white"
        >
          Open Results Screen
        </Link>
        <Link
          href="/wellbeing-who5-score"
          className="w-[300px] rounded-md  border border-slate-300 bg-red-500 text-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-red-600 hover:text-white"
        >
          Open Wellbeing WHO-5 Chart
        </Link>
        <Link
          href="/annual-survey-trend"
          className="w-[300px] rounded-md border border-slate-300 bg-green-500 text-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-green-600 hover:text-white"
        >
          Open Annual Survey Trend
        </Link>
      </div>
    </main>
  );
}
