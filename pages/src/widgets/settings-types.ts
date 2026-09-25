export type Profile = {
  firstName: string;
  lastName: string;
  email: string;
  username?: string;
  avatar?: string;
};
export type Session = {
  id: string;
  device: string;
  location?: string;
  lastActive: string;
};
export type ApiKey = {
  id: string;
  name: string;
  prefix: string;
  createdAt: string;
  lastUsedAt?: string;
  expiresAt?: string;
  permissions?: string[];
};
export type ApiKeyCreateValues = {
  name: string;
  permissions: string[];
  expiresAt?: string;
};
export type CreatedApiKey = { secret: string; name?: string };
