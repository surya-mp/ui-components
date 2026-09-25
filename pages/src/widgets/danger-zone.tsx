'use client';
import { useState } from 'react';
import {
  Button,
  CardDescription,
  Collapsible,
  Input,
  Label,
  Section,
} from '@sypra-ui/ui';
export function DangerZone({
  onDeleteAccount,
  confirmationText = 'DELETE',
}: {
  onDeleteAccount: () => void | Promise<void>;
  confirmationText?: string;
}) {
  const [value, setValue] = useState('');
  return (
    <Section title="Danger zone" description="These actions are permanent.">
      <Collapsible
        title="Delete account"
        className="border-[hsl(var(--rui-destructive))]"
      >
        <CardDescription>
          Delete all account data. This cannot be undone.
        </CardDescription>
        <div className="mt-4 max-w-sm">
          <Label htmlFor="delete-confirmation">
            Type {confirmationText} to confirm
          </Label>
          <Input
            id="delete-confirmation"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder={confirmationText}
          />
        </div>
        <Button
          className="mt-4"
          variant="destructive"
          aria-label="Confirm delete account"
          disabled={value !== confirmationText}
          onClick={() => void onDeleteAccount()}
        >
          Delete account
        </Button>
      </Collapsible>
    </Section>
  );
}
