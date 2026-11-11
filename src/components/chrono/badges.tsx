import { cva } from "class-variance-authority";

import { EVENT_LABELS, type AnalysisStatus, type EventCategory } from "@/lib/video-store";
import { cn } from "@/lib/utils";

const statusVariants = cva("inline-flex items-center whitespace-nowrap rounded-full px-3 py-1 text-[0.82rem] font-semibold text-ink", {
  variants: {
    status: {
      Completed: "bg-menthe",
      Processing: "bg-peche",
      Queued: "bg-secondary",
    },
  },
});

export function StatusBadge({ status }: { status: AnalysisStatus }) {
  return <span className={statusVariants({ status })}>{status}</span>;
}

const eventVariants = cva("inline-flex items-center whitespace-nowrap rounded-full px-3 py-1 text-[0.85rem] font-semibold text-ink", {
  variants: {
    category: {
      restricted: "bg-nectarine-soft",
      line: "bg-peche",
      presence: "bg-menthe",
    },
  },
});

export function EventBadge({ category, className }: { category: EventCategory; className?: string }) {
  return <span className={cn(eventVariants({ category }), className)}>{EVENT_LABELS[category]}</span>;
}

export const EVENT_BOX: Record<EventCategory, string> = {
  restricted: "border-nectarine",
  line: "border-peche",
  presence: "border-menthe",
};
