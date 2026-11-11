import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { PageIntro, PageShell } from "@/components/chrono/page-shell";
import { Switch } from "@/components/ui/switch";
import { EVENT_LABELS, type EventCategory } from "@/lib/video-store";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — ChronoVision" },
      { name: "description", content: "Choose which events ChronoVision detects and how you are notified." },
      { property: "og:title", content: "Settings — ChronoVision" },
      { property: "og:description", content: "Choose which events ChronoVision detects and how you are notified." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [enabled, setEnabled] = useState<Record<EventCategory, boolean>>({
    restricted: true,
    line: true,
    presence: true,
  });
  const [notify, setNotify] = useState(true);

  return (
    <PageShell title="Settings">
      <PageIntro eyebrow="Settings" title="Tune your" accent="workspace." />

      <section className="cv-card relative max-w-2xl divide-y divide-border p-2">
        {(Object.keys(EVENT_LABELS) as EventCategory[]).map((c) => (
          <label key={c} className="flex items-center justify-between px-5 py-4">
            <span className="font-medium text-ink">Detect {EVENT_LABELS[c].toLowerCase()}</span>
            <Switch checked={enabled[c]} onCheckedChange={(v) => setEnabled((s) => ({ ...s, [c]: v }))} />
          </label>
        ))}
        <label className="flex items-center justify-between px-5 py-4">
          <span className="font-medium text-ink">Notify me when an analysis finishes</span>
          <Switch checked={notify} onCheckedChange={setNotify} />
        </label>
      </section>
    </PageShell>
  );
}
