import { ComponentPropsWithRef, ReactNode } from 'react';
import { InithiumBaseProps } from '../../types/component.js';

export type BoxAsElement =
  | 'div'
  | 'section'
  | 'article'
  | 'main'
  | 'aside'
  | 'header'
  | 'footer'
  | 'nav'
  | 'form';

export type BoxProps<E extends BoxAsElement = 'div'> = InithiumBaseProps & {
  children?: ReactNode;
  as?: E;
} & Omit<ComponentPropsWithRef<E>, keyof InithiumBaseProps | 'as' | 'children'>;