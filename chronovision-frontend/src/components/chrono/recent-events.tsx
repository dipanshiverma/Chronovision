import { Link } from "@tanstack/react-router";
import { ArrowRight, Play, Zap } from "lucide-react";

import { EVENT_BOX, EventBadge } from "@/components/chrono/badges";
import type { DetectedEvent } from "@/lib/video-store";
import { cn } from "@/lib/utils";

export function EventRow({ event, highlighted }: { event: DetectedEvent; highlighted?: boolean }) {
  const meta = [
    event.end ? `${event.start} – ${event.end}` : event.start,
    `ID: ${event.trackId}`,
    ...(event.confidence != null ? [event.confidence.toFixed(2)] : []),
  ];

  return (
    <li className={cn("flex items-center gap-4 rounded-2xl py-2", highlighted && "bg-secondary px-2")}>
      <div className="relative h-[4.1rem] w-[6rem] shrink-0 overflow-hidden rounded-lg bg-muted">
        <img src={event.frame} alt="" loading="lazy" width={912} height={736} className="size-full object-cover" />
        <span
          className={cn(
            "absolute left-1/2 top-[22%] h-[52%] w-[22%] -translate-x-1/2 rounded-sm border-2",
            EVENT_BOX[event.category],
          )}
          aria-hidden="true"
        />
      </div>
      <div className="min-w-0 flex-1">
        <EventBadge category={event.category} />
        <p className="mt-1.5 flex flex-wrap items-center gap-x-2.5 text-[0.9rem] font-medium text-ink">
          {meta.map((m, i) => (
            <span key={m} className="flex items-center gap-2.5 whitespace-nowrap">
              {i > 0 && <span className="h-4 w-px bg-ink/30" aria-hidden="true" />}
              {m}
            </span>
          ))}
        </p>
      </div>
      <Link
        to="/timeline"
        search={{ event: event.id }}
        aria-label="Play event"
        className="grid size-10 shrink-0 place-items-center rounded-full bg-nectarine-soft text-nectarine transition-transform hover:scale-105"
      >
        <Play className="ml-0.5 size-4" />
      </Link>
    </li>
  );
}

export function RecentEvents({ events, limit, className }: { events: DetectedEvent[]; limit?: number; className?: string }) {
  const rows = limit ? events.slice(0, limit) : events;
  return (
    <section className={cn("cv-card px-5 py-5", className)}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Zap className="size-7 text-nectarine" strokeWidth={1.8} />
          <h2 className="whitespace-nowrap text-[1.4rem] font-bold text-ink">Recent Events</h2>
        </div>
        <Link
          to="/timeline"
          className="inline-flex items-center gap-1.5 shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium text-ink hover:bg-secondary"
        >
          View All <ArrowRight className="size-4" />
        </Link>
      </div>
      {rows.length ? (
        <ul className="flex flex-col gap-2">
          {rows.map((e) => (
            <EventRow key={e.id} event={e} />
          ))}
        </ul>
      ) : (
        <p className="py-10 text-center text-muted-foreground">No events detected yet.</p>
      )}
    </section>
  );
}
