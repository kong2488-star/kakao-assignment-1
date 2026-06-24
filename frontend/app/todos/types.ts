export type Todo = {
  id: number;
  title: string;
  completed: boolean;
  due_date: string;
  created_at: string;
  updated_at: string;
};

export type TodoStatus = "all" | "active" | "completed";

export type ActionState = {
  error: string | null;
  title: string;
};

export type ActionResult = {
  error: string | null;
};
