import { Link } from "@tanstack/react-router";
import { ArrowRight, Layers, MoreHorizontal, Play, Trash2, Film } from "lucide-react";

import { StatusBadge } from "@/components/chrono/badges";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate, removeVideo, type VideoAnalysis } from "@/lib/video-store";
import { cn } from "@/lib/utils";

export function RecentAnalyses({ videos, limit, className }: { videos: VideoAnalysis[]; limit?: number; className?: string }) {
  const rows = limit ? videos.slice(0, limit) : videos;

  return (
    <section className={cn("cv-card px-5 py-5", className)}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Layers className="size-8 text-lagune" strokeWidth={1.8} />
          <h2 className="whitespace-nowrap text-[1.4rem] font-bold text-ink">Recent Video Analyses</h2>
        </div>
        <Link
          to="/analyse"
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-ink hover:bg-secondary"
        >
          View All <ArrowRight className="size-4" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full whitespace-nowrap text-left text-[0.88rem]">
          <thead>
            <tr className="bg-menthe-soft text-sm font-medium text-ink">
              <th className="rounded-l-xl px-2 py-2.5 font-medium">Video</th>
              <th className="px-2 py-2.5 font-medium">Filename</th>
              <th className="px-2 py-2.5 font-medium">Upload Date</th>
              <th className="px-2 py-2.5 font-medium">Duration</th>
              <th className="px-2 py-2.5 font-medium">Status</th>
              <th className="px-2 py-2.5 font-medium">Events</th>
              <th className="rounded-r-xl px-2 py-2.5"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((v) => (
              <tr key={v.id} className="border-b border-border last:border-b-0">
                <td className="px-0 py-2 pr-2">
                  <Link
                    to="/timeline"
                    search={{ video: v.id }}
                    className="group relative block h-[3.1rem] w-[4.8rem] overflow-hidden rounded-lg bg-muted"
                    aria-label={`Open ${v.filename}`}
                  >
                    {v.thumbnail ? (
                      <img src={v.thumbnail} alt="" loading="lazy" width={992} height={672} className="size-full object-cover" />
                    ) : (
                      <Film className="m-auto mt-4 size-6 text-muted-foreground" />
                    )}
                    <span className="absolute inset-0 grid place-items-center">
                      <span className="grid size-8 place-items-center rounded-full border-2 border-on-brand bg-ink/40 text-on-brand transition-transform group-hover:scale-110">
                        <Play className="size-3.5 fill-current" />
                      </span>
                    </span>
                  </Link>
                </td>
                <td className="px-2 font-semibold text-ink">{v.filename}</td>
                <td className="px-2 text-ink">{formatDate(v.uploadedAt)}</td>
                <td className="px-2 font-medium text-ink">{v.duration ?? "—"}</td>
                <td className="px-2"><StatusBadge status={v.status} /></td>
                <td className="px-2 font-semibold text-ink">{v.events ?? "—"}</td>
                <td className="px-2 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className="grid size-8 place-items-center rounded-full text-ink hover:bg-secondary"
                      aria-label={`Actions for ${v.filename}`}
                    >
                      <MoreHorizontal className="size-5" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to="/timeline" search={{ video: v.id }}>View timeline</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => removeVideo(v.id)} className="text-destructive">
                        <Trash2 className="size-4" /> Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="py-10 text-center text-muted-foreground">
                  No videos yet. Upload one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
