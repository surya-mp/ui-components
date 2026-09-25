import type { ReactNode } from 'react';
import { Section, Stack } from '@sypra-ui/ui';
import { InviteMemberDialog } from '../widgets/invite-member-dialog';
import { OrganizationMemberTable } from '../widgets/organization-member-table';
import { PendingInvitationList } from '../widgets/pending-invitation-list';
import { OrganizationSummary } from '../widgets/organization-summary';
import type {
  Organization,
  OrganizationInvitation,
  OrganizationInvite,
  OrganizationMember,
} from '../widgets/organization-types';

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
