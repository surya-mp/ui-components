'use client';

import { Button } from '@sypra-ui/ui';
import type { AuthProvider } from './auth-types';

function AuthProviderIcon({ provider }: { provider: AuthProvider }) {
  if (provider === 'google') {
    return (
      <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.874 2.684-6.615Z"
        />
        <path
          fill="#34A853"
          d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
        />
        <path
          fill="#FBBC05"
          d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A9 9 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332Z"
        />
        <path
          fill="#EA4335"
          d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.962L3.964 7.294C4.672 5.167 6.656 3.58 9 3.58Z"
        />
      </svg>
    );
  }
  if (provider === 'github') {
    return (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        aria-hidden="true"
        fill="#181717"
      >
        <path d="M12 .5C5.73.5.67 5.56.67 11.83c0 5.02 3.25 9.28 7.77 10.79.57.1.78-.25.78-.55v-1.94c-3.16.69-3.82-1.52-3.82-1.52-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.24 3.34.95.1-.74.4-1.24.72-1.53-2.52-.29-5.18-1.26-5.18-5.6 0-1.24.44-2.25 1.17-3.05-.12-.29-.51-1.44.11-3 0 0 .96-.31 3.15 1.17.91-.25 1.89-.38 2.86-.38.97 0 1.95.13 2.86.38 2.19-1.48 3.15-1.17 3.15-1.17.62 1.56.23 2.71.11 3 .73.8 1.17 1.81 1.17 3.05 0 4.35-2.67 5.31-5.2 5.59.41.35.77 1.05.77 2.11v3.13c0 .3.21.66.79.55 4.51-1.51 7.76-5.77 7.76-10.79C23.33 5.56 18.27.5 12 .5Z" />
      </svg>
    );
  }
  return null;
}

export function AuthProviderButton({
  provider,
  onClick,
  loading,
}: {
  provider: AuthProvider;
  onClick?: () => void;
  loading?: boolean;
}) {
  const name =
    provider === 'github'
      ? 'GitHub'
      : provider.slice(0, 1).toUpperCase() + provider.slice(1);
  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      loading={loading}
      onClick={onClick}
      className="h-auto min-h-11 w-full max-w-sm gap-3 rounded-md border-black/10 bg-white px-6 py-3 text-base text-[hsl(var(--rui-foreground))] shadow-[0_1px_2px_rgba(0,0,0,0.35)] transition-colors hover:bg-white/95 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
    >
      <AuthProviderIcon provider={provider} />
      Continue with {name}
    </Button>
  );
}
