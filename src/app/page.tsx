import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-3xl font-semibold text-gray-800">Mandi POC</h1>
      <p className="text-gray-600">Next.js scaffold copied from fe-simplified-nicoli structure.</p>
      <Link
        href="/results"
        className="rounded-md bg-blue px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-dark"
      >
        Open Results Screen
      </Link>
    </main>
  );
}
