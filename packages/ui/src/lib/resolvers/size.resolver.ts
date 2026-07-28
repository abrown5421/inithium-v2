import { SizeProps } from '../contracts/size.contract.js';
import { formatArbitrary } from '../utils/string.js';

export const resolveSize = (props: SizeProps): string[] => {
  const classes: string[] = [];
  if (props.width) classes.push(`w-${formatArbitrary(props.width)}`);
  if (props.height) classes.push(`h-${formatArbitrary(props.height)}`);
  if (props.minWidth) classes.push(`min-w-${formatArbitrary(props.minWidth)}`);
  if (props.maxWidth) classes.push(`max-w-${formatArbitrary(props.maxWidth)}`);
  if (props.minHeight) classes.push(`min-h-${formatArbitrary(props.minHeight)}`);
  if (props.maxHeight) classes.push(`max-h-${formatArbitrary(props.maxHeight)}`);
  return classes;
};