export type PaginationRangeItem = number | 'ellipsis';

export interface PaginationRangeOptions {
  /** Page buttons shown on either side of the current page once truncated. */
  siblingCount?: number;
  /** Page buttons always shown at the start/end once truncated. */
  boundaryCount?: number;
  /** Truncate once `totalPages` exceeds this count. Unset renders every page. */
  maxVisiblePages?: number;
}

/**
 * Builds the list of page numbers/ellipses to render. With no
 * `maxVisiblePages`, returns every page 1..totalPages so every page gets its
 * own button — the default. Passing `maxVisiblePages` opts into a truncated
 * "1 … 8 9 10 … 20" layout for very long page ranges.
 */
export function getPaginationRange(
  currentPage: number,
  totalPages: number,
  options: PaginationRangeOptions = {},
): PaginationRangeItem[] {
  const { siblingCount = 1, boundaryCount = 1, maxVisiblePages } = options;

  if (totalPages <= 0) return [];

  const all = Array.from({ length: totalPages }, (_, index) => index + 1);
  if (!maxVisiblePages || totalPages <= maxVisiblePages) {
    return all;
  }

  const clampedCurrent = Math.min(Math.max(currentPage, 1), totalPages);
  const leftBoundary = all.slice(0, boundaryCount);
  const rightBoundary = all.slice(totalPages - boundaryCount);

  const siblingStart = Math.max(clampedCurrent - siblingCount, boundaryCount + 1);
  const siblingEnd = Math.min(clampedCurrent + siblingCount, totalPages - boundaryCount);
  const middle = all.slice(siblingStart - 1, siblingEnd);

  const items: PaginationRangeItem[] = [...leftBoundary];

  if (middle[0] !== undefined && middle[0] > boundaryCount + 1) {
    items.push('ellipsis');
  }
  for (const page of middle) {
    if (!items.includes(page)) items.push(page);
  }

  if (middle[middle.length - 1] !== undefined && middle[middle.length - 1] < totalPages - boundaryCount) {
    items.push('ellipsis');
  }

  for (const page of rightBoundary) {
    if (!items.includes(page)) items.push(page);
  }

  return items;
}
