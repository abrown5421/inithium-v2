import { TypographyProps } from '../contracts/typography.contract.js';

export const resolveTypography = (props: TypographyProps): string[] => {
  const classes: string[] = [];
  if (props.size) classes.push(`text-${props.size}`);
  if (props.weight) classes.push(`font-${props.weight}`);
  if (props.textAlign) classes.push(`text-${props.textAlign}`);
  if (props.italic) classes.push('italic');
  if (props.underline) classes.push('underline');
  if (props.strikeThrough) classes.push('line-through');
  if (props.truncate) classes.push('truncate');
  if (props.lineClamp) {
    classes.push(props.lineClamp === 'none' ? 'line-clamp-none' : `line-clamp-${props.lineClamp}`);
  }
  return classes;
};