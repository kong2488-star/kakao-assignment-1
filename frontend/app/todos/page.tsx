import Link from "next/link";

type TodoStatus = "all" | "active" | "completed";

type TodosPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const statusLabels: Record<TodoStatus, string> = {
  all: "전체",
  active: "미완료",
  completed: "완료",
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

function normalizeStatus(value: string | undefined): TodoStatus {
  return value === "active" || value === "completed" ? value : "all";
}

export default async function TodosPage({ searchParams }: TodosPageProps) {
  const params = (await searchParams) ?? {};
  const dueDate = normalizeDueDate(firstValue(params.due_date));
  const status = normalizeStatus(firstValue(params.status));

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-6 px-5 py-8 sm:px-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-purple-700">Kakao Todo</p>
          <h1 className="mt-1 text-3xl font-bold text-purple-950">
            오늘의 할 일
          </h1>
          <p className="mt-2 text-sm text-purple-900">{dueDate}</p>
        </div>
        <Link
          href={`/todos/new?due_date=${dueDate}`}
          className="inline-flex items-center justify-center rounded-md bg-purple-700 px-4 py-2 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          새 할 일
        </Link>
      </header>

      <nav aria-label="완료 상태 필터" className="flex gap-2">
        {(Object.keys(statusLabels) as TodoStatus[]).map((key) => (
          <Link
            key={key}
            href={`/todos?due_date=${dueDate}&status=${key}`}
            aria-current={status === key ? "page" : undefined}
            className={`rounded-md border px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
              status === key
                ? "border-purple-700 bg-purple-700 text-white"
                : "border-purple-200 bg-white text-purple-950"
            }`}
          >
            {statusLabels[key]}
          </Link>
        ))}
      </nav>

      <section className="rounded-lg border border-purple-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-purple-950">
          Todo 기능 구현 예정
        </h2>
        <p className="mt-2 text-sm leading-6 text-purple-900">
          프로젝트 구조가 준비되면 다음 Plan에서 백엔드 API와 프론트엔드 CRUD
          화면을 연결합니다.
        </p>
      </section>
    </main>
  );
}
