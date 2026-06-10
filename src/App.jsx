import { useEffect, useState } from "react";
import AppHeader from "./components/AppHeader.jsx";
import DateNavigator from "./components/DateNavigator.jsx";
import TodoFilter from "./components/TodoFilter.jsx";
import TodoForm from "./components/TodoForm.jsx";
import TodoList from "./components/TodoList.jsx";

const STORAGE_KEY = "todos";

const loadTodos = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export default function App() {
  const [todos, setTodos] = useState(loadTodos);
  const [filter, setFilter] = useState("all");
  const [message, setMessage] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));

  const addTodo = (text, date) => {
    const trimmedText = text.trim();
    const todoDate = date || selectedDate;

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
        date: todoDate,
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

  const filteredTodos = todos.filter((todo) => {
    if (todo.date !== selectedDate) {
      return false;
    }

    if (filter === "active") {
      return !todo.completed;
    }

    if (filter === "completed") {
      return todo.completed;
    }

    return true;
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-violet-50 to-white px-6 py-8 text-zinc-900">
      <div className="mx-auto w-full max-w-xl rounded-2xl bg-white p-7 shadow-2xl shadow-violet-200/50">
        <AppHeader />
        <DateNavigator
          selectedDate={selectedDate}
          onChangeDate={setSelectedDate}
        />
        <TodoForm selectedDate={selectedDate} onAddTodo={addTodo} />
        <p className="mb-3 min-h-6 text-sm font-medium text-red-500">{message}</p>
        <TodoFilter currentFilter={filter} onChangeFilter={setFilter} />
        <TodoList
          filter={filter}
          todos={filteredTodos}
          onUpdateTodo={updateTodo}
          onToggleTodo={toggleTodo}
          onDeleteTodo={deleteTodo}
        />
      </div>
    </main>
  );
}
