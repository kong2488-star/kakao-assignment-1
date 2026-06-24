import { type NextRequest } from "next/server";
import { normalizeStatus } from "../../todos/date-utils";
import { proxyBackend, todoListPath } from "../../todos/todo-api";

export async function GET(request: NextRequest) {
  const dueDate = request.nextUrl.searchParams.get("due_date") ?? "";
  const status = normalizeStatus(
    request.nextUrl.searchParams.get("status") ?? "",
  );

  return proxyBackend(todoListPath(dueDate, status));
}

export async function POST(request: NextRequest) {
  return proxyBackend("/todos", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: await request.text(),
  });
}
