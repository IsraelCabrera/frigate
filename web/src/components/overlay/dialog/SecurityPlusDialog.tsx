import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Event } from "@/types/event";
import { isDesktop, isMobile } from "react-device-detect";
import { ObjectSnapshotTab } from "../detail/SearchDetailDialog";
import { cn } from "@/lib/utils";

type SecurityPlusDialogProps = {
  upload?: Event;
  dialog?: boolean;
  onClose: () => void;
  onEventUploaded: () => void;
};
export function SecurityPlusDialog({
  upload,
  dialog = true,
  onClose,
  onEventUploaded,
}: SecurityPlusDialogProps) {
  if (!upload) {
    return;
  }
  if (dialog) {
    return (
      <Dialog
        open={upload != undefined}
        onOpenChange={(open) => (!open ? onClose() : null)}
      >
        <DialogContent
          className={cn(
            "scrollbar-container overflow-y-auto",
            isDesktop &&
              "max-h-[95dvh] sm:max-w-xl md:max-w-4xl lg:max-w-4xl xl:max-w-7xl",
            isMobile && "px-4",
          )}
        >
          <DialogHeader>
            <DialogTitle className="sr-only">Submit to Security+</DialogTitle>
            <DialogDescription className="sr-only">
              Submit this snapshot to Security+
            </DialogDescription>
          </DialogHeader>
          <ObjectSnapshotTab
            search={upload}
            onEventUploaded={onEventUploaded}
          />
        </DialogContent>
      </Dialog>
    );
  }
}
