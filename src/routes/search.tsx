import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { z } from "zod";

import { EventRow } from "@/components/chrono/recent-events";
import { PageIntro, PageShell } from "@/components/chrono/page-shell";
import { EVENT_LABELS, useVideoStore } from "@/lib/video-store";

const searchSchema = z.object({ q: z.string().optional() });

export const Route = createFileRoute("/search")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Video Search — ChronoVision" },
      { name: "description", content: "Search detected events by type, tracking ID, timestamp or video." },
      { property: "og:title", content: "Video Search — ChronoVision" },
      { property: "og:description", content: "Search detected events by type, tracking ID, timestamp or video." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q = "" } = Route.useSearch();
  const navigate = useNavigate({ from: "/search" });
  const { videos, events } = useVideoStore();
  const term = q.toLowerCase().trim();

  const results = events.filter((e) => {
    if (!term) return true;
    const file = videos.find((v) => v.id === e.videoId)?.filename ?? "";
    return [EVENT_LABELS[e.category], e.start, e.end ?? "", `id: ${e.trackId}`, e.trackId, file]
      .join(" ")
      .toLowerCase()
      .includes(term);
  });

  return (
    <PageShell title="Video Search">
      <PageIntro eyebrow="Search" title="Find the moment" accent="that matters." />

      <div className="relative mb-6 max-w-2xl">
        <Search className="absolute left-5 top-1/2 size-5 -translate-y-1/2 text-ink" />
        <input
          value={q}
          onChange={(e) => navigate({ search: { q: e.target.value || undefined }, replace: true })}
          placeholder="Try “line crossing”, “ID: 07” or “00:02”"
          aria-label="Search events"
          className="h-14 w-full rounded-2xl bg-card pl-14 pr-4 text-base text-ink shadow-soft outline-none ring-ring/40 focus:ring-2"
        />
      </div>

      <section className="cv-card relative max-w-3xl p-6">
        <p className="mb-4 text-sm font-medium text-muted-foreground">
          {results.length} {results.length === 1 ? "event" : "events"}
        </p>
        {results.length ? (
          <ul className="flex flex-col gap-3">
            {results.map((e) => (
              <EventRow key={e.id} event={e} />
            ))}
          </ul>
        ) : (
          <p className="py-8 text-center text-muted-foreground">No events match “{q}”.</p>
        )}
      </section>
    </PageShell>
  );
}
