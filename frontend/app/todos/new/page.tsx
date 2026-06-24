import Link from "next/link";
import { firstValue, normalizeDueDate } from "../date-utils";
import NewTodoForm from "./NewTodoForm";

type NewTodoPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function NewTodoPage({ searchParams }: NewTodoPageProps) {
  const params = (await searchParams) ?? {};
  const dueDate = normalizeDueDate(firstValue(params.due_date));

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col gap-6 px-5 py-8 sm:px-6">
      <div>
        <Link
          href={`/todos?due_date=${dueDate}&status=all`}
          className="text-sm font-semibold text-purple-600 focus:bg-purple-500 focus:text-white focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-offset-2"
        >
          목록으로
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-purple-950">새 할 일</h1>
      </div>

      <NewTodoForm dueDate={dueDate} />
    </main>
  );
}
