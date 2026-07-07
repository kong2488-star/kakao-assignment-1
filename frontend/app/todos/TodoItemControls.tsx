"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteTodoAction, toggleTodoCompletedAction } from "./actions";
import type { Todo } from "./types";

type TodoItemControlsProps = {
  todo: Todo;
};

function buildFormData(todo: Todo, nextCompleted?: boolean) {
  const formData = new FormData();
  formData.set("todo_id", String(todo.id));
  if (typeof nextCompleted === "boolean") {
    formData.set("completed", String(nextCompleted));
  }
  return formData;
}

export default function TodoItemControls({ todo }: TodoItemControlsProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const toggleCompleted = () => {
    setError(null);
    startTransition(async () => {
      const result = await toggleTodoCompletedAction(
        buildFormData(todo, !todo.completed),
      );
      if (result.error) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  };

  const deleteTodo = () => {
    if (!window.confirm("이 할 일을 삭제할까요?")) {
      return;
    }

    setError(null);
    startTransition(async () => {
      const result = await deleteTodoAction(buildFormData(todo));
      if (result.error) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col gap-2 sm:items-end">
      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          onClick={toggleCompleted}
          disabled={isPending}
          className="rounded-md bg-purple-100 px-3 py-2 text-sm font-semibold text-purple-800 transition hover:bg-purple-200 focus:bg-purple-500 focus:text-white focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {todo.completed ? "취소" : "완료"}
        </button>
        <button
          type="button"
          onClick={deleteTodo}
          disabled={isPending}
          className="rounded-md bg-red-100 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-200 focus:bg-red-500 focus:text-white focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          삭제
        </button>
      </div>
      {error ? (
        <p role="alert" className="text-right text-sm font-medium text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
