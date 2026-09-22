'use client';

import { useState, type ReactNode } from 'react';
import { Button, Select } from './forms';
import { cn } from '../lib/utils';

type ChildrenProps = { children?: ReactNode; className?: string };

export function Navbar({
  brand,
  children,
  className,
  label = 'Main navigation',
}: {
  brand?: ReactNode;
  children?: ReactNode;
  className?: string;
  label?: string;
}) {
  return (
    <nav
      aria-label={label}
      className={cn(
        'flex min-h-14 min-w-0 items-center justify-between gap-3 border-b border-[hsl(var(--rui-border))] px-4',
        className,
      )}
    >
      {brand}
      <div className="flex min-w-0 flex-wrap items-center justify-end gap-2">
        {children}
      </div>
    </nav>
  );
}
export function Sidebar({
  children,
  className,
  label = 'Sidebar',
}: ChildrenProps & { label?: string }) {
  return (
    <aside
      aria-label={label}
      className={cn(
        'w-60 shrink-0 border-r border-[hsl(var(--rui-border))] p-3',
        className,
      )}
    >
      {children}
    </aside>
  );
}
export function MobileNav({
  children,
  className,
  label = 'Mobile navigation',
}: ChildrenProps & { label?: string }) {
  return (
    <nav
      aria-label={label}
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 flex justify-around border-t border-[hsl(var(--rui-border))] bg-[hsl(var(--rui-card))] p-2 sm:hidden',
        className,
      )}
    >
      {children}
    </nav>
  );
}
export function Breadcrumb({
  items,
}: {
  items: Array<{ label: string; href?: string }>;
}) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-[hsl(var(--rui-muted-foreground))]">
        {items.map((item, index) => (
          <li
            key={`${item.label}-${index}`}
            className="flex items-center gap-2"
          >
            {index > 0 && <span aria-hidden>/</span>}
            {item.href ? (
              <a
                className="hover:text-[hsl(var(--rui-foreground))]"
                href={item.href}
              >
                {item.label}
              </a>
            ) : (
              <span
                aria-current={index === items.length - 1 ? 'page' : undefined}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
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
export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
  ariaLabel = 'Pagination',
  className,
}: {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  ariaLabel?: string;
  className?: string;
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const visible = Array.from(
    { length: Math.min(pages, 5) },
    (_, i) => Math.max(1, Math.min(pages - 4, page - 3)) + i,
  );
  return (
    <nav
      aria-label={ariaLabel}
      className={cn('flex flex-wrap items-center gap-2', className)}
    >
      <Button
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </Button>
      {visible.map((number) => (
        <Button
          key={number}
          variant={number === page ? 'primary' : 'ghost'}
          size="sm"
          aria-current={number === page ? 'page' : undefined}
          onClick={() => onPageChange(number)}
        >
          {number}
        </Button>
      ))}
      <Button
        variant="outline"
        size="sm"
        disabled={page >= pages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </Button>
      {onPageSizeChange && (
        <Select
          aria-label="Rows per page"
          className="sm:ml-auto w-auto"
          value={pageSize}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size} / page
            </option>
          ))}
        </Select>
      )}
    </nav>
  );
}
