from pydantic import Field

from security.const import DEFAULT_DB_PATH

from .base import SecurityBaseModel

__all__ = ["DatabaseConfig"]


class DatabaseConfig(SecurityBaseModel):
    path: str = Field(default=DEFAULT_DB_PATH, title="Database path.")  # noqa: F821
