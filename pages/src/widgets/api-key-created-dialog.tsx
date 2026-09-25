import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Textarea,
} from '@sypra-ui/ui';
import type { CreatedApiKey } from './settings-types';
export function ApiKeyCreatedDialog({
  apiKey,
  open,
  onOpenChange,
}: {
  apiKey?: CreatedApiKey;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Copy your API key</DialogTitle>
          <DialogDescription>
            Save this key now. It cannot be shown again.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <Textarea
            aria-label="New API key"
            readOnly
            value={apiKey?.secret ?? ''}
          />
        </DialogBody>
        <DialogFooter>
          <DialogClose>Done</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
