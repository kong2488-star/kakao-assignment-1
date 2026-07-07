import Link from "next/link";
import {
  firstValue,
  formatDateLabel,
  normalizeDueDate,
  normalizeStatus,
  shiftDate,
} from "./date-utils";
import { fetchTodos } from "./todo-api";
import TodoItemControls from "./TodoItemControls";
import type { TodoStatus } from "./types";

export const dynamic = "force-dynamic";

type TodosPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const statusLabels: Record<TodoStatus, string> = {
  all: "전체",
  active: "미완료",
  completed: "완료",
};

const emptyMessages: Record<TodoStatus, string> = {
  all: "아직 등록된 할 일이 없습니다.",
  active: "미완료 할 일이 없습니다.",
  completed: "완료된 할 일이 없습니다.",
};

export default async function TodosPage({ searchParams }: TodosPageProps) {
  const params = (await searchParams) ?? {};
  const dueDate = normalizeDueDate(firstValue(params.due_date));
  const status = normalizeStatus(firstValue(params.status));
  const todos = await fetchTodos(dueDate, status);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-6 px-5 py-8 sm:px-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-purple-600">Todo</p>
          <h1 className="mt-1 text-3xl font-bold text-purple-950">
            오늘의 할 일
          </h1>
          <p className="mt-2 text-sm text-purple-900">
            {formatDateLabel(dueDate)}
          </p>
        </div>
        <Link
          href={`/todos/new?due_date=${dueDate}`}
          className="inline-flex items-center justify-center rounded-md bg-purple-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-600 focus:text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
        >
          새 할 일
        </Link>
      </header>

      <nav
        aria-label="날짜 이동"
        className="flex items-center justify-between rounded-lg border border-purple-100 bg-white p-3 shadow-sm"
      >
        <Link
          href={`/todos?due_date=${shiftDate(dueDate, -1)}&status=${status}`}
          className="rounded-md border border-purple-200 bg-white px-3 py-2 text-sm font-semibold text-purple-700 transition hover:bg-purple-50 focus:bg-purple-500 focus:text-white focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-offset-2"
        >
          이전
        </Link>
        <span className="text-sm font-semibold text-purple-950">{dueDate}</span>
        <Link
          href={`/todos?due_date=${shiftDate(dueDate, 1)}&status=${status}`}
          className="rounded-md border border-purple-200 bg-white px-3 py-2 text-sm font-semibold text-purple-700 transition hover:bg-purple-50 focus:bg-purple-500 focus:text-white focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-offset-2"
        >
          다음
        </Link>
      </nav>

      <nav aria-label="완료 상태 필터" className="grid grid-cols-3 gap-2">
        {(Object.keys(statusLabels) as TodoStatus[]).map((key) => (
          <Link
            key={key}
            href={`/todos?due_date=${dueDate}&status=${key}`}
            aria-current={status === key ? "page" : undefined}
            className={`rounded-md border px-3 py-2 text-center text-sm font-medium transition focus:text-white focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-offset-2 ${
              status === key
                ? "border-purple-500 bg-purple-500 text-white"
                : "border-purple-200 bg-white text-purple-950 hover:bg-purple-50 focus:bg-purple-500"
            }`}
          >
            {statusLabels[key]}
          </Link>
        ))}
      </nav>

      {todos.length === 0 ? (
        <section className="rounded-lg border border-purple-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-purple-950">
            {emptyMessages[status]}
          </h2>
          <p className="mt-2 text-sm leading-6 text-purple-900">
            새 할 일을 추가하면 이곳에 표시됩니다.
          </p>
        </section>
      ) : (
        <ul className="flex flex-col gap-3">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex flex-col gap-4 rounded-lg border border-purple-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <Link
                  href={`/todos/${todo.id}`}
                  className={`break-words text-base font-medium focus:bg-purple-500 focus:text-white focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-offset-2 ${
                    todo.completed
                      ? "text-zinc-400 line-through"
                      : "text-purple-950"
                  }`}
                >
                  {todo.title}
                </Link>
                <p className="mt-1 text-xs text-purple-700">
                  {todo.completed ? "완료됨" : "진행 중"}
                </p>
              </div>
              <TodoItemControls todo={todo} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
