import { Text } from '../../primitives/text.js';
import { cn } from '../../utils/cn.js';
import { ColorSwatch } from './color-swatch.js';
import type { ThemeColorOption } from './theme-colors.js';

export interface ThemeColorListProps {
  colors: readonly ThemeColorOption[];
  /** Fires with the option's raw CSS color value (e.g. `var(--primary)`). */
  onSelect: (color: string) => void;
  className?: string;
}

/** A labeled grid of semantic theme swatches. */
export function ThemeColorList({ colors, onSelect, className }: ThemeColorListProps) {
  return (
    <div className={cn('grid grid-cols-4 gap-3', className)} role="listbox" aria-label="Theme colors">
      {colors.map((option) => (
        <button
          key={option.label}
          type="button"
          role="option"
          className="flex flex-col items-center gap-1.5 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          onClick={() => onSelect(option.value)}
        >
          <ColorSwatch color={option.value} size="lg" aria-hidden="true" />
          <Text size="xs" color="muted" className="w-full truncate text-center">
            {option.label}
          </Text>
        </button>
      ))}
    </div>
  );
}
