
from ultralytics import YOLO
from pathlib import Path
import cv2


class ChronoVisionDetector:

    def __init__(self):
        print("Loading YOLO model...")
        self.model = YOLO("yolo11n.pt")
        print("YOLO model loaded!")

    def process_video(self, video_path, output_path):

        video_path = Path(video_path)
        output_path = Path(output_path)

        if not video_path.exists():
            raise FileNotFoundError(f"Video not found: {video_path}")

        output_path.parent.mkdir(parents=True, exist_ok=True)

        cap = cv2.VideoCapture(str(video_path))

        if not cap.isOpened():
            raise ValueError("Could not open video")

        fps = cap.get(cv2.CAP_PROP_FPS) or 25
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

        writer = cv2.VideoWriter(
            str(output_path),
            cv2.VideoWriter_fourcc(*"mp4v"),
            fps,
            (width, height)
        )

        if not writer.isOpened():
            cap.release()
            raise ValueError("Could not create output video")

        detections = []
        frame_number = 0

        try:
            while True:
                ret, frame = cap.read()

                if not ret:
                    break

                results = self.model.track(
                    frame,
                    persist=True,
                    tracker="bytetrack.yaml",
                    conf=0.35,
                    verbose=False
                )

                result = results[0]
                annotated_frame = result.plot()

                if result.boxes is not None:
                    for box in result.boxes:
                        class_id = int(box.cls[0])
                        confidence = float(box.conf[0])

                        track_id = (
                            int(box.id[0])
                            if box.id is not None
                            else None
                        )

                        detections.append({
                            "frame": frame_number,
                            "timestamp": round(frame_number / fps, 2),
                            "object": self.model.names[class_id],
                            "track_id": track_id,
                            "confidence": round(confidence, 3),
                            "bbox": [
                                int(v)
                                for v in box.xyxy[0].tolist()
                            ]
                        })

                writer.write(annotated_frame)
                frame_number += 1

        finally:
            cap.release()
            writer.release()

        return {
            "total_frames": frame_number,
            "total_detections": len(detections),
            "detections": detections,
            "output_video": str(output_path)
        }
