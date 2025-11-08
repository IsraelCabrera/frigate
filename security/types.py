from enum import Enum
from typing import TypedDict

from security.camera import CameraMetrics
from security.data_processing.types import DataProcessorMetrics
from security.object_detection.base import ObjectDetectProcess


class StatsTrackingTypes(TypedDict):
    camera_metrics: dict[str, CameraMetrics]
    embeddings_metrics: DataProcessorMetrics | None
    detectors: dict[str, ObjectDetectProcess]
    started: int
    latest_security_version: str
    last_updated: int
    processes: dict[str, int]


class ModelStatusTypesEnum(str, Enum):
    not_downloaded = "not_downloaded"
    downloading = "downloading"
    downloaded = "downloaded"
    error = "error"
    training = "training"
    complete = "complete"


class TrackedObjectUpdateTypesEnum(str, Enum):
    description = "description"
    face = "face"
    lpr = "lpr"
