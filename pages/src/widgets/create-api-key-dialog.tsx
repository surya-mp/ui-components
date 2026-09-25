'use client';
import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FormField,
  Input,
  Label,
  RadioGroup,
} from '@sypra-ui/ui';
import { ApiKeyCreatedDialog } from './api-key-created-dialog';
import type { ApiKeyCreateValues, CreatedApiKey } from './settings-types';
export function CreateApiKeyDialog({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (
    values: ApiKeyCreateValues,
  ) => CreatedApiKey | void | Promise<CreatedApiKey | void>;
}) {
  const [name, setName] = useState('');
  const [access, setAccess] = useState<'read' | 'write'>('read');
  const [expiresAt, setExpiresAt] = useState('');
  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState<CreatedApiKey>();
  const create = async () => {
    setCreating(true);
    try {
      const result = await onCreate({
        name,
        permissions: access === 'write' ? ['read', 'write'] : ['read'],
        expiresAt: expiresAt || undefined,
      });
      onOpenChange(false);
      if (result) setCreated(result);
    } finally {
      setCreating(false);
    }
  };
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create API key</DialogTitle>
            <DialogDescription>
              The full key should only be shown once by your application.
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            <div>
              <Label htmlFor="key-name">Name</Label>
              <Input
                id="key-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Production"
              />
            </div>
            <RadioGroup
              name="key-access"
              label="Access"
              value={access}
              onValueChange={(value) => setAccess(value as 'read' | 'write')}
              options={[
                { value: 'read', label: 'Read only' },
                {
                  value: 'write',
                  label: 'Read and write',
                  description: 'Allows changes through this key.',
                },
              ]}
            />
            <FormField
              label="Expiration"
              htmlFor="key-expiration"
              description="Leave empty for a key that does not expire."
            >
              <Input
                id="key-expiration"
                type="date"
                value={expiresAt}
                onChange={(event) => setExpiresAt(event.target.value)}
              />
            </FormField>
          </DialogBody>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              onClick={() => void create()}
              disabled={!name.trim()}
              loading={creating}
            >
              Create key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ApiKeyCreatedDialog
        apiKey={created}
        open={Boolean(created)}
        onOpenChange={(next) => {
          if (!next) setCreated(undefined);
        }}
      />
    </>
  );
}
