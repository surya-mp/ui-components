import type { ReactNode } from 'react';
import {
  Avatar,
  Badge,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@sypra-ui/ui';
import type { Organization } from './organization-types';
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
