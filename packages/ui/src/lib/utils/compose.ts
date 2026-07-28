import { twMerge } from 'tailwind-merge';
import { InithiumBaseProps } from '../types/component.js';
import { resolveColor } from '../resolvers/color.resolver.js';
import { resolveAnimation } from '../resolvers/animation.resolver.js';
import { resolveSpacing } from '../resolvers/spacing.resolver.js';
import { resolveBorder } from '../resolvers/border.resolver.js';
import { resolveTypography } from '../resolvers/typography.resolver.js';
import { resolveLayout } from '../resolvers/layout.resolver.js';
import { resolveSize } from '../resolvers/size.resolver.js';
import { resolvePosition } from '../resolvers/position.resolver.js';
import { resolveState } from '../resolvers/state.resolver.js';
import { resolveVisibility } from '../resolvers/visibility.resolver.js';

export const composeClasses = <T extends InithiumBaseProps>(
  props: T,
  defaultClasses: string = ''
): string => {
  const resolved = [
    defaultClasses,
    ...resolveLayout(props),
    ...resolvePosition(props),
    ...resolveSize(props),
    ...resolveSpacing(props),
    ...resolveTypography(props),
    ...resolveBorder(props),
    ...resolveColor(props),
    ...resolveVisibility(props),
    ...resolveState(props),
    ...resolveAnimation(props),
    props.className || ''
  ];

  return twMerge(resolved.filter(Boolean).join(' '));
};