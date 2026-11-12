
from app.services.detector import ChronoVisionDetector

detector = ChronoVisionDetector()

result = detector.process_video(
    "uploads/test.mp4",
    "processed/annotated_test.mp4"
)

print("\nCHRONOVISION ANALYSIS COMPLETE!")
print("Frames:", result["total_frames"])
print("Detections:", result["total_detections"])
print("Output:", result["output_video"])
