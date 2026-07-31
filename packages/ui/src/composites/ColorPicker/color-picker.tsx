import * as React from 'react';
import { Input } from '../../primitives/input.js';
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from '../../primitives/popover.js';
import { cn } from '../../utils/cn.js';
import { ColorPickerPanel } from './color-picker-panel.js';
import type { ColorPickerProps } from './color-picker.types.js';
import { ColorSwatch } from './color-swatch.js';
import { isHexColor, normalizeHex, resolveCssColorToHex } from './resolve-color.js';
import { defaultTailwindPalette } from './tailwind-palette.js';
import { defaultThemeColorOptions } from './theme-colors.js';

/**
 * A hex color input backed by a popover launcher: pick any Tailwind
 * family/intensity or a semantic theme token, or just type a hex code
 * directly. Fully controlled via `value`/`onValueChange`, uncontrolled via
 * `defaultValue` otherwise — mirrors the Combobox composite's contract.
 */
export const ColorPicker = React.forwardRef<HTMLInputElement, ColorPickerProps>(
  (
    {
      value: controlledValue,
      defaultValue,
      onValueChange,
      themeColors = defaultThemeColorOptions,
      tailwindColors = defaultTailwindPalette,
      placeholder = '#000000',
      disabled,
      error,
      required,
      id,
      name,
      className,
      swatchClassName,
      contentClassName,
    },
    ref,
  ) => {
    const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue ?? '');
    const committedValue = controlledValue ?? uncontrolledValue;
    const [draft, setDraft] = React.useState(committedValue);
    const [open, setOpen] = React.useState(false);
    const lastEmittedRef = React.useRef(committedValue);

    // Only resync the visible text from an externally-changed controlled
    // value — never from the echo of our own commit, or a mid-typing hex
    // like `#abc` would jump to `#aabbcc` under the user's cursor.
    React.useEffect(() => {
      if (controlledValue !== undefined && controlledValue !== lastEmittedRef.current) {
        setDraft(controlledValue);
        lastEmittedRef.current = controlledValue;
      }
    }, [controlledValue]);

    const commitHex = (hex: string) => {
      const normalized = normalizeHex(hex);
      lastEmittedRef.current = normalized;
      if (controlledValue === undefined) {
        setUncontrolledValue(normalized);
      }
      onValueChange?.(normalized);
      return normalized;
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const next = event.target.value;
      setDraft(next);
      if (isHexColor(next)) {
        commitHex(next);
      }
    };

    const handleInputBlur = () => {
      setDraft(isHexColor(draft) ? normalizeHex(draft) : committedValue);
    };

    const handlePanelSelect = (color: string) => {
      const normalized = commitHex(resolveCssColorToHex(color, committedValue || '#000000'));
      setDraft(normalized);
    };

    const previewColor = committedValue || '#ffffff';

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverAnchor asChild>
          <div className={cn('relative flex items-center', className)}>
            <Input
              ref={ref}
              id={id}
              name={name}
              value={draft}
              onChange={handleInputChange}
              onFocus={() => setOpen(true)}
              onBlur={handleInputBlur}
              disabled={disabled}
              error={error}
              required={required}
              placeholder={placeholder}
              className="pr-10 font-mono"
              autoComplete="off"
              spellCheck={false}
            />
            <PopoverTrigger asChild>
              <button
                type="button"
                disabled={disabled}
                aria-label="Open color picker"
                className="absolute right-2 flex items-center justify-center rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"
              >
                <ColorSwatch color={previewColor} size="sm" className={swatchClassName} />
              </button>
            </PopoverTrigger>
          </div>
        </PopoverAnchor>
        <PopoverContent align="end" className={cn('w-auto p-3', contentClassName)}>
          <ColorPickerPanel
            tailwindColors={tailwindColors}
            themeColors={themeColors}
            onSelect={handlePanelSelect}
          />
        </PopoverContent>
      </Popover>
    );
  },
);
ColorPicker.displayName = 'ColorPicker';
