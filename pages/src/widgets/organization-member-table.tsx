import {
  Avatar,
  Badge,
  Button,
  Combobox,
  DataTable,
  type DataColumn,
} from '@sypra-ui/ui';
import {
  defaultOrganizationRoles,
  type OrganizationMember,
} from './organization-types';
export function OrganizationMemberTable({
  members,
  roles = defaultOrganizationRoles,
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
