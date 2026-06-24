import type { Todo, TodoStatus } from "./types";

const DEFAULT_BACKEND_API_URL = "http://localhost:8000";

function getBackendApiUrl() {
  return (
    process.env.BACKEND_API_URL?.replace(/\/$/, "") ?? DEFAULT_BACKEND_API_URL
  );
}

function backendUrl(path: string) {
  return `${getBackendApiUrl()}${path}`;
}

async function readErrorMessage(response: Response) {
  if (response.status === 204) {
    return "요청을 처리하지 못했습니다.";
  }

  try {
    const body = (await response.json()) as { detail?: unknown };
    if (typeof body.detail === "string") {
      return body.detail;
    }
    if (Array.isArray(body.detail)) {
      return "입력값을 확인해 주세요.";
    }
  } catch {
    // Ignore malformed error responses and use the fallback below.
  }

  return "요청을 처리하지 못했습니다.";
}

export async function proxyBackend(path: string, init?: RequestInit) {
  const response = await fetch(backendUrl(path), {
    ...init,
    cache: "no-store",
  });

  if (response.status === 204) {
    return new Response(null, { status: response.status });
  }

  const body = await response.text();
  return new Response(body, {
    status: response.status,
    headers: {
      "content-type":
        response.headers.get("content-type") ?? "application/json",
    },
  });
}

export function todoListPath(dueDate: string, status: TodoStatus) {
  const params = new URLSearchParams({ due_date: dueDate });
  if (status === "active") {
    params.set("completed", "false");
  }
  if (status === "completed") {
    params.set("completed", "true");
  }
  return `/todos?${params.toString()}`;
}

export async function fetchTodos(dueDate: string, status: TodoStatus) {
  const response = await fetch(backendUrl(todoListPath(dueDate, status)), {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return (await response.json()) as Todo[];
}

export async function fetchTodo(todoId: string) {
  const response = await fetch(backendUrl(`/todos/${todoId}`), {
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return (await response.json()) as Todo;
}

export async function createTodo(title: string, dueDate: string) {
  const response = await fetch(backendUrl("/todos"), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ title, due_date: dueDate }),
    cache: "no-store",
  });

  if (!response.ok) {
    return { error: await readErrorMessage(response), todo: null };
  }

  return { error: null, todo: (await response.json()) as Todo };
}

export async function updateTodoTitle(todoId: string, title: string) {
  const response = await fetch(backendUrl(`/todos/${todoId}`), {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ title }),
    cache: "no-store",
  });

  if (!response.ok) {
    return { error: await readErrorMessage(response), todo: null };
  }

  return { error: null, todo: (await response.json()) as Todo };
}

export async function updateTodoCompleted(todoId: string, completed: boolean) {
  const response = await fetch(backendUrl(`/todos/${todoId}`), {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ completed }),
    cache: "no-store",
  });

  if (!response.ok) {
    return { error: await readErrorMessage(response) };
  }

  return { error: null };
}

export async function removeTodo(todoId: string) {
  const response = await fetch(backendUrl(`/todos/${todoId}`), {
    method: "DELETE",
    cache: "no-store",
  });

  if (!response.ok) {
    return { error: await readErrorMessage(response) };
  }

  return { error: null };
}
