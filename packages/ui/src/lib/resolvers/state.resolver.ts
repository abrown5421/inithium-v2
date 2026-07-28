import { StateProps } from '../contracts/state.contract.js';

export const resolveState = (props: StateProps): string[] => {
  const classes: string[] = [];
  if (props.disabled) classes.push('opacity-50', 'pointer-events-none', 'cursor-not-allowed');
  if (props.loading) classes.push('animate-pulse', 'pointer-events-none');
  if (props.invalid) classes.push('border-error', 'text-error');
  return classes;
};