import { LayoutProps } from '../contracts/layout.contract.js';
import { formatArbitrary } from '../utils/string.js';

export const resolveLayout = (props: LayoutProps): string[] => {
  const classes: string[] = [];
  if (props.display) classes.push(props.display);
  if (props.direction) classes.push(`flex-${props.direction}`);
  if (props.justify) classes.push(`justify-${props.justify}`);
  if (props.align) classes.push(`items-${props.align}`);
  if (props.wrap) classes.push(`flex-${props.wrap}`);
  
  if (props.gap !== undefined) {
    if (typeof props.gap === 'object') {
      if (props.gap.x !== undefined) classes.push(`gap-x-${formatArbitrary(props.gap.x)}`);
      if (props.gap.y !== undefined) classes.push(`gap-y-${formatArbitrary(props.gap.y)}`);
    } else {
      classes.push(`gap-${formatArbitrary(props.gap)}`);
    }
  }

  if (props.cols) classes.push(props.cols === 'none' ? 'grid-cols-none' : `grid-cols-${props.cols}`);
  if (props.rows) classes.push(props.rows === 'none' ? 'grid-rows-none' : `grid-rows-${props.rows}`);

  return classes;
};