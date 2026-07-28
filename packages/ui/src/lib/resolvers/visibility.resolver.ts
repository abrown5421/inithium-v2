import { VisibilityProps } from '../contracts/visibility.contract.js';

export const resolveVisibility = (props: VisibilityProps): string[] => {
  const classes: string[] = [];
  if (props.hidden) classes.push('hidden');
  if (props.srOnly) classes.push('sr-only');
  if (props.opacity !== undefined) classes.push(`opacity-${props.opacity}`);
  if (props.pointerEvents) classes.push(`pointer-events-${props.pointerEvents}`);
  return classes;
};