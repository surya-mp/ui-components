'use client';

import { useState, type FormEvent, type ReactNode } from 'react';
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  Combobox,
  DataTable,
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
  Section,
  Select,
  Stack,
  type DataColumn,
} from '@sypra-ui/ui';

export type Organization = {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  avatar?: string;
  plan?: string;
};

export type OrganizationMember = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  joinedAt?: string;
};

export type OrganizationInvitation = {
  id: string;
  email: string;
  role: string;
  expiresAt?: string;
};

export type OrganizationInvite = Pick<OrganizationInvitation, 'email' | 'role'>;

const defaultRoles = ['Owner', 'Admin', 'Member', 'Viewer'];

export function OrganizationSummary({
  organization,
  actions,
}: {
  organization: Organization;
  actions?: ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-3">
          <Avatar src={organization.avatar} alt={organization.name} />
          <div>
            <CardTitle>{organization.name}</CardTitle>
            {(organization.slug || organization.description) && (
              <CardDescription>
                {organization.slug
                  ? `@${organization.slug}`
                  : organization.description}
              </CardDescription>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {organization.plan && (
            <Badge variant="outline">{organization.plan}</Badge>
          )}
          {actions}
        </div>
      </CardHeader>
      {organization.slug && organization.description && (
        <p className="text-sm text-[hsl(var(--rui-muted-foreground))]">
          {organization.description}
        </p>
      )}
    </Card>
  );
}

export function InviteMemberDialog({
  roles = defaultRoles,
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

export function OrganizationMemberTable({
  members,
  roles = defaultRoles,
  onChangeRole,
  onRemove,
}: {
  members: OrganizationMember[];
  roles?: string[];
  onChangeRole?: (member: OrganizationMember, role: string) => void;
  onRemove?: (member: OrganizationMember) => void;
}) {
  const columns: DataColumn<OrganizationMember>[] = [
    {
      key: 'name',
      header: 'Member',
      sortable: true,
      cell: (member) => (
        <span className="flex min-w-40 items-center gap-3">
          <Avatar src={member.avatar} alt={member.name} />
          <span className="min-w-0">
            <strong className="block truncate text-sm">{member.name}</strong>
            <span className="block truncate text-sm text-[hsl(var(--rui-muted-foreground))]">
              {member.email}
            </span>
          </span>
        </span>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      cell: (member) =>
        onChangeRole ? (
          <Combobox
            ariaLabel={`Role for ${member.name}`}
            className="min-w-32"
            value={member.role}
            options={[
              ...(!roles.includes(member.role)
                ? [{ value: member.role, label: member.role }]
                : []),
              ...roles.map((role) => ({ value: role, label: role })),
            ]}
            onValueChange={(role) => onChangeRole(member, role)}
          />
        ) : (
          <Badge variant="outline">{member.role}</Badge>
        ),
    },
    {
      key: 'joinedAt',
      header: 'Joined',
      className: 'hidden md:table-cell',
      cell: (member) => member.joinedAt ?? '—',
    },
    {
      key: 'id',
      header: <span className="sr-only">Actions</span>,
      className: onRemove ? undefined : 'hidden',
      cell: (member) =>
        onRemove && (
          <Button variant="ghost" size="sm" onClick={() => onRemove(member)}>
            Remove
          </Button>
        ),
    },
  ];
  return (
    <DataTable
      data={members}
      columns={columns}
      emptyMessage="No members yet."
    />
  );
}

export function PendingInvitationList({
  invitations,
  onResend,
  onRevoke,
}: {
  invitations: OrganizationInvitation[];
  onResend?: (invitation: OrganizationInvitation) => void;
  onRevoke?: (invitation: OrganizationInvitation) => void;
}) {
  if (!invitations.length)
    return (
      <p className="text-sm text-[hsl(var(--rui-muted-foreground))]">
        No pending invitations.
      </p>
    );
  return (
    <div className="divide-y divide-[hsl(var(--rui-border))] rounded-[var(--rui-radius)] border border-[hsl(var(--rui-border))]">
      {invitations.map((invitation) => (
        <div
          key={invitation.id}
          className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{invitation.email}</p>
            <p className="text-sm text-[hsl(var(--rui-muted-foreground))]">
              {invitation.role}
              {invitation.expiresAt && ` · Expires ${invitation.expiresAt}`}
            </p>
          </div>
          {(onResend || onRevoke) && (
            <div className="flex flex-wrap gap-2">
              {onResend && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onResend(invitation)}
                >
                  Resend
                </Button>
              )}
              {onRevoke && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRevoke(invitation)}
                >
                  Revoke
                </Button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function OrganizationPage({
  organization,
  members,
  invitations = [],
  roles,
  onInvite,
  onChangeRole,
  onRemoveMember,
  onResendInvitation,
  onRevokeInvitation,
  summaryActions,
  sections,
  children,
}: {
  organization: Organization;
  members: OrganizationMember[];
  invitations?: OrganizationInvitation[];
  roles?: string[];
  onInvite?: (invite: OrganizationInvite) => void | Promise<void>;
  onChangeRole?: (member: OrganizationMember, role: string) => void;
  onRemoveMember?: (member: OrganizationMember) => void;
  onResendInvitation?: (invitation: OrganizationInvitation) => void;
  onRevokeInvitation?: (invitation: OrganizationInvitation) => void;
  summaryActions?: ReactNode;
  sections?: { summary?: boolean; members?: boolean; invitations?: boolean };
  children?: ReactNode;
}) {
  const visibleSections = {
    summary: true,
    members: true,
    invitations: true,
    ...sections,
  };
  return (
    <Stack gap={8}>
      {visibleSections.summary && (
        <OrganizationSummary
          organization={organization}
          actions={summaryActions}
        />
      )}
      {visibleSections.members && (
        <Section
          title="Members"
          description="Manage access for this organization."
        >
          <div className="flex justify-end">
            {onInvite && (
              <InviteMemberDialog roles={roles} onInvite={onInvite} />
            )}
          </div>
          <OrganizationMemberTable
            members={members}
            roles={roles}
            onChangeRole={onChangeRole}
            onRemove={onRemoveMember}
          />
        </Section>
      )}
      {visibleSections.invitations && (
        <Section title="Pending invitations">
          <PendingInvitationList
            invitations={invitations}
            onResend={onResendInvitation}
            onRevoke={onRevokeInvitation}
          />
        </Section>
      )}
      {children}
    </Stack>
  );
}
