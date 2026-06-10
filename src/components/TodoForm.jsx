import { useState } from "react";

export default function TodoForm({ selectedDate, onAddTodo }) {
  const [todoText, setTodoText] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onAddTodo(todoText, selectedDate);
    setTodoText("");
  };

  return (
    <form className="mb-3 flex gap-3" onSubmit={handleSubmit}>
      <input
        className="min-w-0 flex-1 rounded-xl border border-violet-100 px-4 py-3 text-base outline-none transition focus:border-violet-600 focus:ring-4 focus:ring-violet-100"
        type="text"
        value={todoText}
        onChange={(event) => setTodoText(event.target.value)}
        placeholder="할 일을 입력하세요"
      />
      <button
        className="rounded-xl bg-violet-700 px-5 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-violet-800"
        type="submit"
      >
        추가
      </button>
    </form>
  );
}
