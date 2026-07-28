import { forwardRef, ReactNode } from 'react';
import { TextProps, TextAsElement } from './text.types.js';
import { composeClasses } from '../../utils/index.js';

type TextComponent = <E extends TextAsElement = 'span'>(
  props: TextProps<E>
) => ReactNode;

export const Text = forwardRef(function Text<E extends TextAsElement = 'span'>(
  props: TextProps<E>,
  ref: React.ForwardedRef<any>
) {
  const {
    text,
    children,
    as,
    className,
    textColor,
    backgroundColor,
    borderColor,
    ringColor,
    animation,
    padding,
    margin,
    border,
    radius,
    size,
    weight,
    textAlign,
    italic,
    underline,
    strikeThrough,
    truncate,
    lineClamp,
    display,
    direction,
    justify,
    align,
    wrap,
    gap,
    cols,
    rows,
    width,
    height,
    minWidth,
    maxWidth,
    minHeight,
    maxHeight,
    position,
    inset,
    zIndex,
    disabled,
    loading,
    invalid,
    required,
    readOnly,
    hidden,
    srOnly,
    opacity,
    pointerEvents,
    ...domProps
  } = props;

  const Component = as || 'p';
  const combinedClasses = composeClasses(props);
  const content = text ?? children;

  return (
    <Component
      ref={ref}
      className={combinedClasses}
      {...(domProps as Record<string, unknown>)}
    >
      {content}
    </Component>
  );
}) as unknown as TextComponent;

(Text as { displayName?: string }).displayName = 'Text';