'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@sypra-ui/ui';
import { AuthForm } from './auth-form';
import type { AuthProps } from './auth-types';

export function AuthModal({
  open,
  onOpenChange,
  ...props
}: AuthProps & { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Welcome back</DialogTitle>
          <DialogDescription>Sign in to your account.</DialogDescription>
        </DialogHeader>
        <AuthForm mode="login" {...props} />
      </DialogContent>
    </Dialog>
  );
}
