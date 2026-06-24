"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createTodo,
  removeTodo,
  updateTodoCompleted,
  updateTodoTitle,
} from "./todo-api";
import type { ActionResult, ActionState } from "./types";

function formString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function revalidateTodos() {
  revalidatePath("/todos");
}

export async function createTodoAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const title = formString(formData, "title");
  const dueDate = formString(formData, "due_date");
  const result = await createTodo(title, dueDate);

  if (result.error || !result.todo) {
    return {
      error: result.error ?? "할 일을 만들지 못했습니다.",
      title,
    };
  }

  revalidateTodos();
  redirect(`/todos?due_date=${result.todo.due_date}&status=all`);
}

export async function updateTodoTitleAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const todoId = formString(formData, "todo_id");
  const title = formString(formData, "title");
  const result = await updateTodoTitle(todoId, title);

  if (result.error || !result.todo) {
    return {
      error: result.error ?? "할 일을 수정하지 못했습니다.",
      title,
    };
  }

  revalidateTodos();
  redirect(`/todos?due_date=${result.todo.due_date}&status=all`);
}

export async function toggleTodoCompletedAction(
  formData: FormData,
): Promise<ActionResult> {
  const todoId = formString(formData, "todo_id");
  const completed = formString(formData, "completed") === "true";
  const result = await updateTodoCompleted(todoId, completed);

  if (result.error) {
    return { error: result.error };
  }

  revalidateTodos();
  return { error: null };
}

export async function deleteTodoAction(
  formData: FormData,
): Promise<ActionResult> {
  const todoId = formString(formData, "todo_id");
  const result = await removeTodo(todoId);

  if (result.error) {
    return { error: result.error };
  }

  revalidateTodos();
  return { error: null };
}
