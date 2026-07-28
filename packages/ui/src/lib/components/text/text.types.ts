import { ComponentPropsWithRef, ReactNode } from 'react';
import { InithiumBaseProps } from '../../types/index.js';

export type TextAsElement =
  | 'p'
  | 'span'
  | 'div'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'label'
  | 'strong'
  | 'em';

export type TextProps<E extends TextAsElement = 'span'> = InithiumBaseProps & {
  text?: string;
  children?: ReactNode;
  as?: E;
} & Omit<ComponentPropsWithRef<E>, keyof InithiumBaseProps | 'text' | 'as' | 'children'>;