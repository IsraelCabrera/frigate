from pydantic import Field

from .base import SecurityBaseModel

__all__ = ["TlsConfig"]


class TlsConfig(SecurityBaseModel):
    enabled: bool = Field(default=True, title="Enable TLS for port 8971")
