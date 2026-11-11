import { createFileRoute } from "@tanstack/react-router";

import { PageIntro, PageShell } from "@/components/chrono/page-shell";
import { EVENT_LABELS, useVideoStore, type EventCategory } from "@/lib/video-store";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports — ChronoVision" },
      { name: "description", content: "Summary of analysed footage and detected event types." },
      { property: "og:title", content: "Reports — ChronoVision" },
      { property: "og:description", content: "Summary of analysed footage and detected event types." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReportsPage,
});

const BAR: Record<EventCategory, string> = {
  restricted: "bg-nectarine",
  line: "bg-peche",
  presence: "bg-menthe",
};

function ReportsPage() {
  const { videos, events } = useVideoStore();
  const completed = videos.filter((v) => v.status === "Completed").length;
  const totalEvents = videos.reduce((n, v) => n + (v.events ?? 0), 0);
  const counts = (Object.keys(EVENT_LABELS) as EventCategory[]).map((c) => ({
    c,
    n: events.filter((e) => e.category === c).length,
  }));
  const max = Math.max(1, ...counts.map((x) => x.n));

  const stats = [
    { label: "Videos", value: videos.length, tone: "bg-peche-soft" },
    { label: "Analyses completed", value: completed, tone: "bg-menthe-soft" },
    { label: "Events detected", value: totalEvents, tone: "bg-lagune-soft" },
  ];

  return (
    <PageShell title="Reports">
      <PageIntro eyebrow="Reports" title="The week," accent="at a glance." />

      <div className="relative mb-6 grid grid-cols-3 gap-6">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-[1.75rem] p-6 shadow-soft ${s.tone}`}>
            <p className="text-sm font-medium text-ink/80">{s.label}</p>
            <p className="mt-2 text-5xl font-bold text-ink">{s.value}</p>
          </div>
        ))}
      </div>

      <section className="cv-card relative max-w-3xl p-6">
        <h2 className="mb-5 text-2xl font-bold text-ink">Recent events by type</h2>
        <div className="flex flex-col gap-4">
          {counts.map(({ c, n }) => (
            <div key={c}>
              <div className="mb-1.5 flex justify-between text-sm font-medium text-ink">
                <span>{EVENT_LABELS[c]}</span>
                <span>{n}</span>
              </div>
              <div className="h-3 rounded-full bg-secondary">
                <div className={`h-3 rounded-full ${BAR[c]}`} style={{ width: `${(n / max) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
