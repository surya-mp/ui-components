import { Button } from '@sypra-ui/ui';
import type { OrganizationInvitation } from './organization-types';
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
