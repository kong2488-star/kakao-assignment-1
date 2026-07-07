import { redirect } from "next/navigation";

function getTodayInKorea() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export default function HomePage() {
  redirect(`/todos?due_date=${getTodayInKorea()}&status=all`);
}
