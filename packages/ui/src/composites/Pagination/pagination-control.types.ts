import * as React from 'react';
import type { ButtonProps } from '../../primitives/button.js';

export interface PaginationControlProps {
  /** Current 1-indexed page. Fully controlled — the consumer owns this state. */
  currentPage: number;
  totalPages: number;
  /** Fires with the next 1-indexed page whenever the user changes pages. */
  onPageChange: (page: number) => void;
  /** Page buttons shown on either side of the current page once truncated. */
  siblingCount?: number;
  /** Page buttons always shown at the start/end once truncated. */
  boundaryCount?: number;
  /**
   * Truncates the number buttons with an ellipsis once `totalPages` exceeds
   * this count. Unset by default, so every page gets its own button.
   */
  maxVisiblePages?: number;
  /** Hides the previous/next arrow buttons. Defaults to shown. */
  showPrevNext?: boolean;
  size?: ButtonProps['size'];
  disabled?: boolean;
  previousLabel?: string;
  nextLabel?: string;
  previousIcon?: React.ReactNode;
  nextIcon?: React.ReactNode;
  /** Customizes what's rendered inside each page button. Defaults to the page number. */
  renderPageLabel?: (page: number) => React.ReactNode;
  className?: string;
}
