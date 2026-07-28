import { ElementType } from 'react';
import { BoxProps, BoxAsElement } from './box.types.js';
import { composeClasses } from '../../utils/compose.js';

export const Box = <E extends BoxAsElement = 'div'>({
  as,
  children,
  defaultClasses = '',
  ...props
}: BoxProps<E> & { defaultClasses?: string }) => {
  const Component = (as || 'div') as ElementType;
  const classes = composeClasses(props, defaultClasses);

  return (
    <Component className={classes} {...(props as Record<string, unknown>)}>
      {children}
    </Component>
  );
};