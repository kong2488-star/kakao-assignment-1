import TodoItem from "./TodoItem.jsx";

export default function TodoList({
  todos,
  onUpdateTodo,
  onToggleTodo,
  onDeleteTodo,
}) {
  if (todos.length === 0) {
    return (
      <p className="rounded-2xl border border-violet-100 bg-violet-50 p-4 text-zinc-500">
        아직 등록된 할 일이 없습니다.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onUpdateTodo={onUpdateTodo}
          onToggleTodo={onToggleTodo}
          onDeleteTodo={onDeleteTodo}
        />
      ))}
    </ul>
  );
}
