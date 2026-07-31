import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../primitives/button.js';
import { PaginationEllipsis } from '../../primitives/pagination.js';
import { cn } from '../../utils/cn.js';
import { getPaginationRange } from './pagination-range.js';
import type { PaginationControlProps } from './pagination-control.types.js';

/**
 * A button-driven pagination control: previous/next arrows plus a number
 * button per page so users can jump straight to any page. Fully controlled —
 * this composite holds no page state of its own, it just reports clicks via
 * `onPageChange`.
 */
export function PaginationControl({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  boundaryCount = 1,
  maxVisiblePages,
  showPrevNext = true,
  size = 'icon',
  disabled = false,
  previousLabel = 'Go to previous page',
  nextLabel = 'Go to next page',
  previousIcon,
  nextIcon,
  renderPageLabel,
  className,
}: PaginationControlProps) {
  const items = React.useMemo(
    () => getPaginationRange(currentPage, totalPages, { siblingCount, boundaryCount, maxVisiblePages }),
    [currentPage, totalPages, siblingCount, boundaryCount, maxVisiblePages],
  );

  const goTo = (page: number) => {
    if (page === currentPage || page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination-control"
      className={cn('flex items-center gap-1', className)}
    >
      {showPrevNext ? (
        <Button
          type="button"
          variant="outline"
          size={size}
          aria-label={previousLabel}
          disabled={disabled || currentPage <= 1}
          onClick={() => goTo(currentPage - 1)}
        >
          {previousIcon ?? <ChevronLeft className="size-4" />}
        </Button>
      ) : null}

      <ul className="flex items-center gap-1">
        {items.map((item, index) =>
          item === 'ellipsis' ? (
            <li key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </li>
          ) : (
            <li key={item}>
              <Button
                type="button"
                variant={item === currentPage ? 'outline' : 'ghost'}
                size={size}
                aria-label={`Go to page ${item}`}
                aria-current={item === currentPage ? 'page' : undefined}
                disabled={disabled}
                onClick={() => goTo(item)}
              >
                {renderPageLabel ? renderPageLabel(item) : item}
              </Button>
            </li>
          ),
        )}
      </ul>

      {showPrevNext ? (
        <Button
          type="button"
          variant="outline"
          size={size}
          aria-label={nextLabel}
          disabled={disabled || currentPage >= totalPages}
          onClick={() => goTo(currentPage + 1)}
        >
          {nextIcon ?? <ChevronRight className="size-4" />}
        </Button>
      ) : null}
    </nav>
  );
}
