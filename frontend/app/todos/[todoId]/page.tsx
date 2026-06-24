import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchTodo } from "../todo-api";
import EditTodoForm from "./EditTodoForm";

export const dynamic = "force-dynamic";

type TodoDetailPageProps = {
  params: Promise<{
    todoId: string;
  }>;
};

export default async function TodoDetailPage({ params }: TodoDetailPageProps) {
  const { todoId } = await params;
  const todo = await fetchTodo(todoId);

  if (!todo) {
    notFound();
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col gap-6 px-5 py-8 sm:px-6">
      <div>
        <Link
          href={`/todos?due_date=${todo.due_date}&status=all`}
          className="text-sm font-semibold text-purple-600 focus:bg-purple-500 focus:text-white focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-offset-2"
        >
          목록으로
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-purple-950">할 일 수정</h1>
        <p className="mt-2 text-sm text-purple-900">{todo.due_date}</p>
      </div>

      <EditTodoForm todoId={todo.id} title={todo.title} />
    </main>
  );
}
