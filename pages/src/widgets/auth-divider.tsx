import { Separator } from '@sypra-ui/ui';
import type { ReactNode } from 'react';

export function AuthDivider({ label = 'OR' }: { label?: ReactNode }) {
  return (
    <div className="flex items-center gap-3 text-xs text-[hsl(var(--rui-muted-foreground))]">
      <Separator />
      <span>{label}</span>
      <Separator />
    </div>
  );
}
