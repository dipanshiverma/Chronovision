import type { ReactNode } from "react";

import { TopBar } from "@/components/chrono/top-bar";

export function PageShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden px-8 pt-6 pb-8">
      {/* soft warm wash */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[75%] bg-wash" aria-hidden="true" />
      <div className="relative">
        <TopBar title={title} />
        {children}
      </div>
    </div>
  );
}

export function PageIntro({ eyebrow, title, accent, children }: { eyebrow: string; title: string; accent?: string; children?: ReactNode }) {
  return (
    <div className="mb-8 max-w-3xl">
      <p className="eyebrow mb-3 text-ink">{eyebrow}</p>
      <h1 className="font-display-italic text-5xl leading-[1.05] text-ink">
        {title} {accent && <span className="text-nectarine">{accent}</span>}
      </h1>
      {children && <p className="mt-4 text-lg text-ink/80">{children}</p>}
    </div>
  );
}
