import { createFileRoute } from "@tanstack/react-router";
import { Upload, Film } from "lucide-react";
import { useRef, useState, type DragEvent } from "react";
import { toast } from "sonner";

import { PageIntro, PageShell } from "@/components/chrono/page-shell";
import { RecentAnalyses } from "@/components/chrono/recent-analyses";
import { Button } from "@/components/ui/button";
import { addUploadedVideo, useVideoStore, type VideoAnalysis } from "@/lib/video-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/analyse")({
  head: () => ({
    meta: [
      { title: "Analyse Video — ChronoVision" },
      { name: "description", content: "Upload surveillance footage to ChronoVision for event analysis." },
      { property: "og:title", content: "Analyse Video — ChronoVision" },
      { property: "og:description", content: "Upload surveillance footage to ChronoVision for event analysis." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AnalysePage,
});

/** Reads duration and grabs a frame from a local video file in the browser. */
function readVideoMeta(file: File): Promise<{ duration: number | null; thumbnail: string | null }> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;
    video.src = url;
    const done = (duration: number | null, thumbnail: string | null) => {
      URL.revokeObjectURL(url);
      resolve({ duration, thumbnail });
    };
    video.onloadedmetadata = () => {
      video.currentTime = Math.min(1, (video.duration || 0) / 2);
    };
    video.onseeked = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 320;
        canvas.height = Math.round((320 * video.videoHeight) / (video.videoWidth || 1)) || 180;
        canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);
        done(video.duration, canvas.toDataURL("image/jpeg", 0.8));
      } catch {
        done(video.duration, null);
      }
    };
    video.onerror = () => done(null, null);
  });
}

function AnalysePage() {
  const { videos } = useVideoStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [current, setCurrent] = useState<VideoAnalysis | null>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      toast.error("Please choose a video file.");
      return;
    }
    setBusy(true);
    const meta = await readVideoMeta(file);
    const v = addUploadedVideo(file, meta.duration, meta.thumbnail);
    setCurrent(v);
    setBusy(false);
    toast.success(`${file.name} added`, { description: "Queued for analysis." });
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <PageShell title="Analyse Video">
      <PageIntro eyebrow="Analyse" title="Bring in new" accent="footage.">
        Upload a recording and ChronoVision will queue it for event detection.
      </PageIntro>

      <div className="relative grid grid-cols-[1fr_1.2fr] gap-6">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={cn(
            "cv-card flex flex-col items-center justify-center gap-4 border-2 border-dashed p-10 text-center transition-colors",
            dragging ? "border-nectarine bg-secondary" : "border-border",
          )}
        >
          <div className="grid size-16 place-items-center rounded-full bg-peche-soft text-ink">
            <Upload className="size-7" />
          </div>
          <p className="text-xl font-bold text-ink">Drop a video here</p>
          <p className="text-muted-foreground">MP4, MOV or WEBM</p>
          <input
            ref={inputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => {
              handleFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
          <Button variant="peche" size="action" disabled={busy} onClick={() => inputRef.current?.click()}>
            <Upload /> {busy ? "Reading video…" : "Upload Video"}
          </Button>
        </div>

        <div className="cv-card overflow-hidden p-4">
          {current?.src ? (
            <div>
              <video src={current.src} controls className="aspect-video w-full rounded-2xl bg-ink" />
              <div className="mt-3 flex items-center justify-between px-2">
                <p className="font-semibold text-ink">{current.filename}</p>
                <p className="text-sm text-muted-foreground">{current.duration ?? "—"}</p>
              </div>
            </div>
          ) : (
            <div className="grid aspect-video place-items-center rounded-2xl bg-secondary text-muted-foreground">
              <div className="flex flex-col items-center gap-2">
                <Film className="size-8" />
                <p>Your preview will appear here</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <RecentAnalyses videos={videos} className="relative mt-6" />
    </PageShell>
  );
}
