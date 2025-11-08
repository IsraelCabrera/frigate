"""Run recording maintainer and cleanup."""

import logging
from multiprocessing.synchronize import Event as MpEvent

from security.config import SecurityConfig
from security.const import PROCESS_PRIORITY_MED
from security.review.maintainer import ReviewSegmentMaintainer
from security.util.process import SecurityProcess

logger = logging.getLogger(__name__)


class ReviewProcess(SecurityProcess):
    def __init__(self, config: SecurityConfig, stop_event: MpEvent) -> None:
        super().__init__(
            stop_event,
            PROCESS_PRIORITY_MED,
            name="security.review_segment_manager",
            daemon=True,
        )
        self.config = config

    def run(self) -> None:
        self.pre_run_setup(self.config.logger)
        maintainer = ReviewSegmentMaintainer(
            self.config,
            self.stop_event,
        )
        maintainer.start()
