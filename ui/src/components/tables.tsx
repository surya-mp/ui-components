'use client';

import {
  useMemo,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
  type TableHTMLAttributes,
} from 'react';
import { Input } from './forms';
import { EmptyState, ErrorState, LoadingState } from './feedback';
import { Pagination } from './navigation';
import { cn } from '../lib/utils';

export const Table = ({
  className,
  ...props
}: TableHTMLAttributes<HTMLTableElement>) => (
  <div className="w-full overflow-x-auto">
    <table className={cn('w-full text-left text-sm', className)} {...props} />
  </div>
);
export const TableHeader = ({
  className,
  ...props
}: ComponentPropsWithoutRef<'thead'>) => (
  <thead
    className={cn(
      'border-b border-[hsl(var(--rui-border))] text-xs uppercase tracking-wide text-[hsl(var(--rui-muted-foreground))]',
      className,
    )}
    {...props}
  />
);
export const TableBody = ({
  className,
  ...props
}: ComponentPropsWithoutRef<'tbody'>) => (
  <tbody
    className={cn('divide-y divide-[hsl(var(--rui-border))]', className)}
    {...props}
  />
);
export const TableFooter = ({
  className,
  ...props
}: ComponentPropsWithoutRef<'tfoot'>) => (
  <tfoot
    className={cn('border-t border-[hsl(var(--rui-border))]', className)}
    {...props}
  />
);
export const TableRow = ({
  className,
  ...props
}: ComponentPropsWithoutRef<'tr'>) => (
  <tr
    className={cn('transition hover:bg-[hsl(var(--rui-muted))]/60', className)}
    {...props}
  />
);
export const TableHead = ({
  className,
  ...props
}: ComponentPropsWithoutRef<'th'>) => (
  <th
    scope="col"
    className={cn('px-4 py-3 font-medium', className)}
    {...props}
  />
);
export const TableCell = ({
  className,
  ...props
}: ComponentPropsWithoutRef<'td'>) => (
  <td className={cn('px-4 py-3', className)} {...props} />
);
export const TableCaption = ({
  className,
  ...props
}: ComponentPropsWithoutRef<'caption'>) => (
  <caption
    className={cn(
      'mt-3 text-left text-sm text-[hsl(var(--rui-muted-foreground))]',
      className,
    )}
    {...props}
  />
);
export type DataColumn<T> = {
  key: keyof T | string;
  header: ReactNode;
  cell?: (row: T) => ReactNode;
  sortable?: boolean;
  className?: string;
};
export type DataTablePagination = {
  page: number;
  pageSize: number;
  total: number;
};
export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  loading,
  error,
  pagination,
  onPageChange,
  onRowClick,
  emptyMessage = 'No results found.',
  className,
}: {
  data: T[];
  columns: DataColumn<T>[];
  loading?: boolean;
  error?: ReactNode;
  pagination?: DataTablePagination;
  onPageChange?: (page: number) => void;
  onRowClick?: (row: T) => void;
  emptyMessage?: ReactNode;
  className?: string;
}) {
  const [sort, setSort] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);
  const rows = useMemo(() => {
    if (!sort) return data;
    return [...data].sort((a, b) => {
      const result = String(a[sort.key] ?? '').localeCompare(
        String(b[sort.key] ?? ''),
        undefined,
        { numeric: true },
      );
      return sort.direction === 'asc' ? result : -result;
    });
  }, [data, sort]);
  const toggle = (column: DataColumn<T>) => {
    if (!column.sortable) return;
    const key = String(column.key);
    setSort((current) =>
      current?.key === key && current.direction === 'asc'
        ? { key, direction: 'desc' }
        : { key, direction: 'asc' },
    );
  };
  if (error) return <ErrorState title={error} />;
  return (
    <div className={className} aria-busy={loading}>
      {loading && <LoadingState label="Updating table…" />}
      {!loading && !rows.length ? (
        <EmptyState title={emptyMessage} />
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead
                    key={String(column.key)}
                    className={column.className}
                  >
                    {column.sortable ? (
                      <button
                        className="rui-focus inline-flex items-center gap-1"
                        onClick={() => toggle(column)}
                      >
                        {column.header}
                        <span aria-hidden="true">
                          {sort?.key === String(column.key)
                            ? sort.direction === 'asc'
                              ? '↑'
                              : '↓'
                            : '↕'}
                        </span>
                      </button>
                    ) : (
                      column.header
                    )}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow
                  key={String(row.id ?? index)}
                  tabIndex={onRowClick ? 0 : undefined}
                  onClick={() => onRowClick?.(row)}
                  onKeyDown={(event) => {
                    if (
                      onRowClick &&
                      (event.key === 'Enter' || event.key === ' ')
                    )
                      onRowClick(row);
                  }}
                  className={onRowClick ? 'cursor-pointer' : undefined}
                >
                  {columns.map((column) => (
                    <TableCell
                      key={String(column.key)}
                      className={column.className}
                    >
                      {column.cell
                        ? column.cell(row)
                        : String(row[column.key] ?? '')}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {pagination && onPageChange && (
            <Pagination
              className="mt-4"
              {...pagination}
              ariaLabel="Table pagination"
              onPageChange={onPageChange}
            />
          )}
        </>
      )}
    </div>
  );
}
export function SearchableTable<T extends Record<string, unknown>>({
  data,
  columns,
  searchKeys,
  ...props
}: Omit<ComponentPropsWithoutRef<typeof DataTable<T>>, 'data'> & {
  data: T[];
  columns: DataColumn<T>[];
  searchKeys: Array<keyof T>;
}) {
  const [query, setQuery] = useState('');
  const filtered = data.filter((row) =>
    searchKeys.some((key) =>
      String(row[key] ?? '')
        .toLowerCase()
        .includes(query.toLowerCase()),
    ),
  );
  return (
    <div className="space-y-3">
      <Input
        aria-label="Search table"
        placeholder="Search…"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <DataTable data={filtered} columns={columns} {...props} />
    </div>
  );
}
export const PaginatedTable = DataTable;
