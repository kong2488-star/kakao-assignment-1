const filters = [
  { label: "전체", value: "all" },
  { label: "진행중", value: "active" },
  { label: "완료", value: "completed" },
];

export default function TodoFilter({ currentFilter, onChangeFilter }) {
  return (
    <div className="mb-4 grid grid-cols-3 rounded-2xl bg-violet-50 p-1">
      {filters.map((filter) => {
        const isSelected = currentFilter === filter.value;

        return (
          <button
            key={filter.value}
            className={[
              "rounded-xl px-3 py-2 text-sm font-semibold transition",
              isSelected
                ? "bg-white text-violet-700 shadow-sm shadow-violet-200"
                : "text-zinc-500 hover:text-violet-700",
            ]
              .filter(Boolean)
              .join(" ")}
            type="button"
            onClick={() => onChangeFilter(filter.value)}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
