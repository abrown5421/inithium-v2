import { AnimationProps } from '../contracts/animation.contract.js';

export const resolveAnimation = (props: AnimationProps): string[] => {
  if (!props.animation) return [];
  
  const classes: string[] = ['animate__animated'];
  
  if (typeof props.animation === 'string') {
    classes.push(`animate__${props.animation}`);
    return classes;
  }
  
  const { name, delay, duration, infinite, repeat } = props.animation;
  classes.push(`animate__${name}`);
  
  if (infinite) classes.push('animate__infinite');
  if (delay) classes.push(typeof delay === 'number' ? `animate__delay-${delay}s` : `animate__delay-${delay}`);
  if (duration) classes.push(`animate__${duration}`);
  if (repeat) classes.push(`animate__repeat-${repeat}`);
  
  return classes;
};