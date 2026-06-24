"use client";

import { useActionState } from "react";
import { createTodoAction } from "../actions";
import type { ActionState } from "../types";

type NewTodoFormProps = {
  dueDate: string;
};

const initialState: ActionState = {
  error: null,
  title: "",
};

export default function NewTodoForm({ dueDate }: NewTodoFormProps) {
  const [state, formAction, isPending] = useActionState(
    createTodoAction,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="rounded-lg border border-purple-100 bg-white p-6 shadow-sm"
    >
      <input type="hidden" name="due_date" value={dueDate} />
      <label
        htmlFor="title"
        className="block text-sm font-semibold text-purple-950"
      >
        제목
      </label>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <input
          id="title"
          name="title"
          type="text"
          defaultValue={state.title}
          placeholder="할 일을 입력하세요"
          disabled={isPending}
          className="min-w-0 flex-1 rounded-md border border-purple-200 px-3 py-2 text-purple-950 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
        />
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-purple-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-600 focus:text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "추가 중" : "추가"}
        </button>
      </div>
      {state.error ? (
        <p role="alert" className="mt-3 text-sm font-medium text-red-600">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
