'use client';
import { useState, type FormEvent, type ReactNode } from 'react';
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
  DialogTrigger,
  Input,
  Label,
  Select,
} from '@sypra-ui/ui';
import {
  defaultOrganizationRoles,
  type OrganizationInvite,
} from './organization-types';
export function InviteMemberDialog({
  roles = defaultOrganizationRoles,
  onInvite,
  trigger = <Button>Invite member</Button>,
}: {
  roles?: string[];
  onInvite: (invite: OrganizationInvite) => void | Promise<void>;
  trigger?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState(
    roles.includes('Member') ? 'Member' : (roles[0] ?? 'Member'),
  );
  const [loading, setLoading] = useState(false);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      await onInvite({ email, role });
      setEmail('');
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite a member</DialogTitle>
          <DialogDescription>
            They will receive an email with a workspace invitation.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={(event) => void submit(event)}>
          <DialogBody>
            <div>
              <Label htmlFor="organization-invite-email">Email</Label>
              <Input
                id="organization-invite-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="organization-invite-role">Role</Label>
              <Select
                id="organization-invite-role"
                value={role}
                onChange={(event) => setRole(event.target.value)}
              >
                {roles.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </Select>
            </div>
          </DialogBody>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" loading={loading}>
              Send invitation
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
