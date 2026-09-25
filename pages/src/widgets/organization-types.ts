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
export const defaultOrganizationRoles = ['Owner', 'Admin', 'Member', 'Viewer'];
