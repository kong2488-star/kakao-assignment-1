"use client";

export default function TodosError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-semibold text-purple-950">
        할 일을 불러오지 못했습니다
      </h1>
      <button
        type="button"
        onClick={reset}
        className="rounded-md bg-purple-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-600 focus:text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
      >
        다시 시도
      </button>
    </main>
  );
}
