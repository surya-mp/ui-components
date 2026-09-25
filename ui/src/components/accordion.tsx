'use client';
import { useState, type ReactNode } from 'react';
export function Accordion({
  items,
  type = 'single',
}: {
  items: Array<{ value: string; title: ReactNode; content: ReactNode }>;
  type?: 'single' | 'multiple';
}) {
  const [open, setOpen] = useState<string[]>([]);
  const toggle = (value: string) =>
    setOpen((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : type === 'single'
          ? [value]
          : [...current, value],
    );
  return (
    <div className="divide-y divide-[hsl(var(--rui-border))]">
      {items.map((item) => (
        <div key={item.value}>
          <button
            className="rui-focus flex w-full items-center justify-between py-3 text-left font-medium"
            aria-expanded={open.includes(item.value)}
            onClick={() => toggle(item.value)}
          >
            {item.title}
            <span>{open.includes(item.value) ? '−' : '+'}</span>
          </button>
          {open.includes(item.value) && (
            <div className="pb-3 text-sm text-[hsl(var(--rui-muted-foreground))]">
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
