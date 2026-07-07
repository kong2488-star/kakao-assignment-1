import { type NextRequest } from "next/server";
import { proxyBackend } from "../../../todos/todo-api";

type TodoRouteContext = {
  params: Promise<{
    todoId: string;
  }>;
};

export async function GET(_request: NextRequest, context: TodoRouteContext) {
  const { todoId } = await context.params;
  return proxyBackend(`/todos/${todoId}`);
}

export async function PATCH(request: NextRequest, context: TodoRouteContext) {
  const { todoId } = await context.params;
  return proxyBackend(`/todos/${todoId}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: await request.text(),
  });
}

export async function DELETE(_request: NextRequest, context: TodoRouteContext) {
  const { todoId } = await context.params;
  return proxyBackend(`/todos/${todoId}`, {
    method: "DELETE",
  });
}
