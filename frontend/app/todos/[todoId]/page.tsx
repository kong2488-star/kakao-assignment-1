import Link from "next/link";

type TodoDetailPageProps = {
  params: Promise<{
    todoId: string;
  }>;
};

export default async function TodoDetailPage({ params }: TodoDetailPageProps) {
  const { todoId } = await params;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col gap-6 px-5 py-8 sm:px-6">
      <div>
        <Link
          href="/todos"
          className="text-sm font-semibold text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          목록으로
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-purple-950">할 일 수정</h1>
        <p className="mt-2 text-sm text-purple-900">ID: {todoId}</p>
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
