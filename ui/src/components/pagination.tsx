'use client';
import { cn } from '../lib/utils';
import { Button } from './button';
import { Select } from './select';
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
