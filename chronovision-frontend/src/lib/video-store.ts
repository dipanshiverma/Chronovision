import { useSyncExternalStore } from "react";

export type AnalysisStatus = "Completed" | "Processing" | "Queued";

export interface VideoAnalysis {
  id: string;
  filename: string;
  uploadedAt: string; // ISO date
  duration: string | null; // hh:mm:ss
  status: AnalysisStatus;
  events: number | null;
  thumbnail: string | null;
  src?: string; // object URL for videos uploaded in this session
  sample?: boolean;
}

export type EventCategory = "restricted" | "line" | "presence";

export interface DetectedEvent {
  id: string;
  videoId: string;
  category: EventCategory;
  start: string;
  end?: string;
  trackId: string;
  confidence?: number;
  frame: string;
}

export const EVENT_LABELS: Record<EventCategory, string> = {
  restricted: "Restricted-Zone Entry",
  line: "Line Crossing",
  presence: "Prolonged Presence",
};

interface State {
  videos: VideoAnalysis[];
  events: DetectedEvent[];
}

let state: State = { videos: [], events: [] };
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const getSnapshot = () => state;
const getServerSnapshot = () => state;

export function useVideoStore() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function formatDuration(seconds: number) {
  const s = Math.max(0, Math.round(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return [h, m, sec].map((n) => String(n).padStart(2, "0")).join(":");
}

/** Adds an uploaded video to this session. It stays "Queued" — no results are invented. */
export function addUploadedVideo(file: File, durationSeconds: number | null, thumbnail: string | null) {
  const video: VideoAnalysis = {
    id: `u-${Date.now()}`,
    filename: file.name,
    uploadedAt: new Date().toISOString().slice(0, 10),
    duration: durationSeconds != null ? formatDuration(durationSeconds) : null,
    status: "Queued",
    events: null,
    thumbnail,
    src: URL.createObjectURL(file),
  };
  state = { ...state, videos: [video, ...state.videos] };
  emit();
  return video;
}

export function removeVideo(id: string) {
  const v = state.videos.find((x) => x.id === id);
  if (v?.src) URL.revokeObjectURL(v.src);
  state = {
    videos: state.videos.filter((x) => x.id !== id),
    events: state.events.filter((e) => e.videoId !== id),
  };
  emit();
}

export function formatDate(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
