import { useState } from "react";

export default function TodoItem({
  todo,
  onUpdateTodo,
  onToggleTodo,
  onDeleteTodo,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const startEditing = () => {
    setEditText(todo.text);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setEditText(todo.text);
    setIsEditing(false);
  };

  const submitEdit = (event) => {
    event.preventDefault();

    if (onUpdateTodo(todo.id, editText)) {
      setIsEditing(false);
    }
  };

  return (
    <li className="flex items-center justify-between gap-4 rounded-2xl border border-violet-100 bg-violet-50 p-4">
      {isEditing ? (
        <form className="flex min-w-0 flex-1 gap-2" onSubmit={submitEdit}>
          <input
            className="min-w-0 flex-1 rounded-xl border border-violet-200 bg-white px-3 py-2 outline-none transition focus:border-violet-600 focus:ring-4 focus:ring-violet-100"
            type="text"
            value={editText}
            onChange={(event) => setEditText(event.target.value)}
          />
          <button
            className="rounded-xl bg-violet-700 px-3 py-2 text-sm font-semibold text-white"
            type="submit"
          >
            저장
          </button>
          <button
            className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-600"
            type="button"
            onClick={cancelEditing}
          >
            취소
          </button>
        </form>
      ) : (
        <>
          <span
            className={`min-w-0 flex-1 break-words text-base ${
              todo.completed ? "text-zinc-400 line-through" : "text-zinc-900"
            }`}
          >
            {todo.text}
          </span>
          <div className="flex shrink-0 gap-2">
            <button
              className="rounded-xl border border-violet-200 bg-white px-3 py-2 text-sm font-semibold text-violet-700"
              type="button"
              onClick={startEditing}
            >
              수정
            </button>
            <button
              className="rounded-xl bg-violet-200 px-3 py-2 text-sm font-semibold text-violet-800"
              type="button"
              onClick={() => onToggleTodo(todo.id)}
            >
              {todo.completed ? "취소" : "완료"}
            </button>
            <button
              className="rounded-xl bg-red-100 px-3 py-2 text-sm font-semibold text-red-600"
              type="button"
              onClick={() => onDeleteTodo(todo.id)}
            >
              삭제
            </button>
          </div>
        </>
      )}
    </li>
  );
}
