import type { ReactNode } from 'react';

export type AuthProvider = 'google' | 'github' | string;
export type LoginOption = 'email-password' | AuthProvider;
export type AuthValues = { email: string; password: string; name?: string };
export type ResetPasswordValues = {
  password: string;
  confirmation: string;
  token?: string;
};
export type AuthMethods = {
  emailPassword?: boolean;
  google?: boolean;
  github?: boolean;
};
export type AuthProps = {
  authMethods?: AuthMethods;
  loginOptions?: LoginOption[];
  providers?: AuthProvider[];
  emailPassword?: boolean;
  loading?: boolean;
  error?: ReactNode;
  onSubmit?: (values: AuthValues) => void | Promise<void>;
  onProviderLogin?: (provider: AuthProvider) => void;
  onForgotPassword?: () => void;
  onSignup?: () => void;
  onLogin?: () => void;
  children?: ReactNode;
};
