import Link from "next/link";

type NewTodoPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getTodayInKorea() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function normalizeDueDate(value: string | undefined) {
  return value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : getTodayInKorea();
}

export default async function NewTodoPage({ searchParams }: NewTodoPageProps) {
  const params = (await searchParams) ?? {};
  const dueDate = normalizeDueDate(firstValue(params.due_date));

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col gap-6 px-5 py-8 sm:px-6">
      <div>
        <Link
          href={`/todos?due_date=${dueDate}&status=all`}
          className="text-sm font-semibold text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          목록으로
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-purple-950">새 할 일</h1>
      </div>

      <form className="rounded-lg border border-purple-100 bg-white p-6 shadow-sm">
        <label
          htmlFor="title"
          className="block text-sm font-semibold text-purple-950"
        >
          제목
        </label>
        <input
          id="title"
          name="title"
          type="text"
          disabled
          placeholder="다음 Plan에서 연결됩니다"
          className="mt-2 w-full rounded-md border border-purple-200 px-3 py-2 text-purple-950"
        />
      </form>
    </main>
  );
}
