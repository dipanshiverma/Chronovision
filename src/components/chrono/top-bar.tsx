import { useNavigate } from "@tanstack/react-router";
import { Bell, Search } from "lucide-react";
import { useState, type FormEvent } from "react";

export function TopBar({ title }: { title: string }) {
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    navigate({ to: "/search", search: { q: q.trim() || undefined } });
  };

  return (
    <header className="relative z-20 flex items-center justify-between gap-6 pb-6">
      <p className="text-[1.05rem] font-medium text-ink">{title}</p>
      <div className="flex items-center gap-6">
        <form onSubmit={onSubmit} className="relative w-[min(26rem,36vw)]">
          <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-ink" strokeWidth={1.8} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search videos, events or timestamps..."
            aria-label="Search videos, events or timestamps"
            className="h-12 w-full rounded-2xl bg-field pl-12 pr-4 text-sm text-ink placeholder:text-muted-foreground outline-none ring-ring/40 focus:ring-2"
          />
        </form>
        <button
          type="button"
          aria-label="Notifications"
          className="grid size-10 place-items-center rounded-full text-ink hover:bg-secondary"
        >
          <Bell className="size-6" strokeWidth={1.6} />
        </button>
        <div
          aria-label="Account"
          className="grid size-12 place-items-center rounded-full bg-lagune text-lg font-medium text-on-brand"
        >
          D
        </div>
      </div>
    </header>
  );
}
