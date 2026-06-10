function parseDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatLabel(dateString) {
  const [year, month, day] = dateString.split("-");
  return `${year}년 ${month}월 ${day}일`;
}

export default function DateNavigator({ selectedDate, onChangeDate }) {
  const changeDate = (days) => {
    const nextDate = parseDate(selectedDate);
    nextDate.setDate(nextDate.getDate() + days);
    onChangeDate(formatDate(nextDate));
  };

  return (
    <div className="mb-5 flex items-center justify-between rounded-2xl border border-violet-100 bg-violet-50 p-4">
      <button
        type="button"
        className="rounded-xl border border-violet-200 bg-white px-4 py-2 text-sm font-semibold text-violet-700 transition hover:bg-violet-50"
        onClick={() => changeDate(-1)}
      >
        이전
      </button>
      <p className="text-sm font-semibold text-zinc-700">{formatLabel(selectedDate)}</p>
      <button
        type="button"
        className="rounded-xl border border-violet-200 bg-white px-4 py-2 text-sm font-semibold text-violet-700 transition hover:bg-violet-50"
        onClick={() => changeDate(1)}
      >
        다음
      </button>
    </div>
  );
}
