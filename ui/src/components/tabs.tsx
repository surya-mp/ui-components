'use client';
import { useState, type ReactNode } from 'react';
import { cn } from '../lib/utils';
export function Tabs({
  tabs,
  value,
  defaultValue,
  onValueChange,
  className,
}: {
  tabs: Array<{
    value: string;
    label: ReactNode;
    content: ReactNode;
    disabled?: boolean;
  }>;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}) {
  const [local, setLocal] = useState(defaultValue ?? tabs[0]?.value ?? '');
  const selected = value ?? local;
  const choose = (next: string) => {
    if (value === undefined) setLocal(next);
    onValueChange?.(next);
  };
  const active = tabs.find((tab) => tab.value === selected);
  return (
    <div className={className}>
      <div
        role="tablist"
        className="flex gap-1 overflow-x-auto border-b border-[hsl(var(--rui-border))]"
      >
        {tabs.map((tab) => (
          <button
            key={tab.value}
            role="tab"
            aria-selected={tab.value === selected}
            disabled={tab.disabled}
            onClick={() => choose(tab.value)}
            className={cn(
              'rui-focus shrink-0 whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium transition',
              tab.value === selected
                ? 'border-[hsl(var(--rui-primary))]'
                : 'border-transparent text-[hsl(var(--rui-muted-foreground))]',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="py-4">
        {active?.content}
      </div>
    </div>
  );
}
