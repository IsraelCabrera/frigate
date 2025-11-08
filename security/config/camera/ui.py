from pydantic import Field

from ..base import SecurityBaseModel

__all__ = ["CameraUiConfig"]


class CameraUiConfig(SecurityBaseModel):
    order: int = Field(default=0, title="Order of camera in UI.")
    dashboard: bool = Field(
        default=True, title="Show this camera in Security dashboard UI."
    )
