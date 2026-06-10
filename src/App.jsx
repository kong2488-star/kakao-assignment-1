import { useState } from "react";
import AppHeader from "./components/AppHeader.jsx";
import TodoForm from "./components/TodoForm.jsx";
import TodoList from "./components/TodoList.jsx";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [message, setMessage] = useState("");

  const addTodo = (text) => {
    const trimmedText = text.trim();

    if (!trimmedText) {
      setMessage("할 일을 입력해 주세요.");
      return;
    }

    setTodos((currentTodos) => [
      ...currentTodos,
      {
        id: crypto.randomUUID(),
        text: trimmedText,
        completed: false,
      },
    ]);
    setMessage("");
  };

  const updateTodo = (id, text) => {
    const trimmedText = text.trim();

    if (!trimmedText) {
      setMessage("수정할 내용을 입력해 주세요.");
      return false;
    }

    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id ? { ...todo, text: trimmedText } : todo
      )
    );
    setMessage("");
    return true;
  };

  const toggleTodo = (id) => {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-violet-50 to-white px-6 py-8 text-zinc-900">
      <div className="mx-auto w-full max-w-xl rounded-2xl bg-white p-7 shadow-2xl shadow-violet-200/50">
        <AppHeader />
        <TodoForm onAddTodo={addTodo} />
        <p className="mb-3 min-h-6 text-sm font-medium text-red-500">{message}</p>
        <TodoList
          todos={todos}
          onUpdateTodo={updateTodo}
          onToggleTodo={toggleTodo}
          onDeleteTodo={deleteTodo}
        />
      </div>
    </main>
  );
}
