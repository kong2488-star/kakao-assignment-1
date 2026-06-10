import TodoItem from "./TodoItem.jsx";

export default function TodoList({
  filter,
  todos,
  onUpdateTodo,
  onToggleTodo,
  onDeleteTodo,
}) {
  const emptyMessages = {
    all: "아직 등록된 할 일이 없습니다.",
    active: "진행중인 할 일이 없습니다.",
    completed: "완료된 할 일이 없습니다.",
  };

  if (todos.length === 0) {
    return (
      <p className="rounded-2xl border border-violet-100 bg-violet-50 p-4 text-zinc-500">
        {emptyMessages[filter]}
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
