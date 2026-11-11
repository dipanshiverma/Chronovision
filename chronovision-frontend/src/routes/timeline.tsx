import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";

import { EventRow } from "@/components/chrono/recent-events";
import { PageIntro, PageShell } from "@/components/chrono/page-shell";
import { useVideoStore } from "@/lib/video-store";
import { cn } from "@/lib/utils";

const searchSchema = z.object({
  video: z.string().optional(),
  event: z.string().optional(),
});

export const Route = createFileRoute("/timeline")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Event Timeline — ChronoVision" },
      { name: "description", content: "Every detected event across your analysed videos, in order." },
      { property: "og:title", content: "Event Timeline — ChronoVision" },
      { property: "og:description", content: "Every detected event across your analysed videos, in order." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TimelinePage,
});

function TimelinePage() {
  const { video, event } = Route.useSearch();
  const { videos, events } = useVideoStore();
  const shown = video ? videos.filter((v) => v.id === video) : videos;

  return (
    <PageShell title="Event Timeline">
      <PageIntro eyebrow="Timeline" title="Every moment," accent="in order.">
        Events grouped by the video they were found in.
      </PageIntro>

      <div className="mb-5 flex flex-wrap gap-2">
        <Link
          to="/timeline"
          className={cn("rounded-full px-4 py-2 text-sm font-medium", !video ? "bg-ink text-on-brand" : "bg-secondary text-ink")}
        >
          All videos
        </Link>
        {videos.map((v) => (
          <Link
            key={v.id}
            to="/timeline"
            search={{ video: v.id }}
            className={cn("rounded-full px-4 py-2 text-sm font-medium", video === v.id ? "bg-ink text-on-brand" : "bg-secondary text-ink")}
          >
            {v.filename}
          </Link>
        ))}
      </div>

      <div className="relative grid grid-cols-2 gap-6">
        {shown.map((v) => {
          const list = events.filter((e) => e.videoId === v.id);
          return (
            <section key={v.id} className="cv-card p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-ink">{v.filename}</h2>
                <span className="text-sm text-muted-foreground">{v.duration ?? "—"}</span>
              </div>
              {v.src && <video src={v.src} controls className="mb-4 aspect-video w-full rounded-2xl bg-ink" />}
              {list.length ? (
                <ul className="flex flex-col gap-3">
                  {list.map((e) => (
                    <EventRow key={e.id} event={e} highlighted={e.id === event} />
                  ))}
                </ul>
              ) : (
                <p className="py-6 text-muted-foreground">
                  {v.status === "Completed" ? "No events found in this video." : "Waiting for analysis — no events yet."}
                </p>
              )}
            </section>
          );
        })}
      </div>
    </PageShell>
  );
}
