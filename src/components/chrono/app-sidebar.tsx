import { Link, useRouterState } from "@tanstack/react-router";
import { BarChart3, Home, Play, Search, Settings, Waypoints } from "lucide-react";

import plantLeaves from "@/assets/plant-leaves.png";
import chronoLogo from "@/assets/chronovision-logo.png";
import { cn } from "@/lib/utils";

export const NAV_ITEMS = [
  { title: "Overview", to: "/", icon: Home },
  { title: "Analyse Video", to: "/analyse", icon: Play },
  { title: "Event Timeline", to: "/timeline", icon: Waypoints },
  { title: "Video Search", to: "/search", icon: Search },
  { title: "Reports", to: "/reports", icon: BarChart3 },
  { title: "Settings", to: "/settings", icon: Settings },
] as const;

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-(--sidebar-w) flex-col overflow-hidden bg-sidebar text-sidebar-foreground">
      <Link to="/" aria-label="ChronoVision home" className="mx-5 mt-6 mb-8 block rounded-2xl bg-white px-3 py-2 shadow-soft">
        <img src={chronoLogo} alt="ChronoVision" width={952} height={614} className="h-auto w-full" />
      </Link>

      <nav className="relative z-10 flex flex-col gap-1.5 px-5">
        {NAV_ITEMS.map((item) => {
          const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-4 rounded-2xl px-5 py-3.5 text-[1.05rem] font-medium transition-colors",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-soft"
                  : "text-sidebar-foreground hover:bg-sidebar-accent",
              )}
            >
              <item.icon className="size-6 shrink-0" strokeWidth={1.6} />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Decorative organic shapes */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[46%]" aria-hidden="true">
        <div className="blob -right-20 bottom-24 size-60 bg-peche" />
        <div className="blob -left-24 -bottom-24 h-64 w-[150%] bg-lagune" />
        <img
          src={plantLeaves}
          alt=""
          width={768}
          height={1024}
          loading="lazy"
          className="absolute -left-10 bottom-20 w-[62%] -rotate-6 opacity-95"
        />
      </div>

      <div className="relative z-10 mt-auto px-5 pb-6">
        <div className="rounded-2xl bg-sidebar-accent px-4 py-3.5 shadow-soft">
          <p className="text-[1.05rem] font-semibold">ChronoVision v1.0</p>
          <p className="whitespace-nowrap text-[0.8rem] opacity-90">Video Surveillance Platform</p>
        </div>
      </div>
    </aside>
  );
}
