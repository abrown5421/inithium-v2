const HEX_PATTERN = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

export function isHexColor(value: string): boolean {
  return HEX_PATTERN.test(value.trim());
}

/** Expands 3-digit hex to 6-digit and lower-cases the result. */
export function normalizeHex(value: string): string {
  const hex = value.trim();
  const shortMatch = /^#([0-9a-f]{3})$/i.exec(hex);
  if (shortMatch) {
    const [r, g, b] = shortMatch[1].split('');
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }
  return hex.toLowerCase();
}

function channelToHex(channel: number): string {
  return Math.max(0, Math.min(255, Math.round(channel))).toString(16).padStart(2, '0');
}

let probeElement: HTMLSpanElement | null = null;

function getProbeElement(): HTMLSpanElement | null {
  if (typeof document === 'undefined') return null;
  if (!probeElement) {
    const el = document.createElement('span');
    el.setAttribute('aria-hidden', 'true');
    el.style.position = 'fixed';
    el.style.top = '-9999px';
    el.style.left = '-9999px';
    el.style.pointerEvents = 'none';
    document.body.appendChild(el);
    probeElement = el;
  }
  return probeElement;
}

let canvasContext: CanvasRenderingContext2D | null = null;

function getCanvasContext(): CanvasRenderingContext2D | null {
  if (typeof document === 'undefined') return null;
  if (!canvasContext) {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    canvasContext = canvas.getContext('2d', { willReadFrequently: true });
  }
  return canvasContext;
}

/**
 * Resolves any valid CSS color — a hex string, `oklch()`, `hsl()`, a
 * `var(--token)` reference, etc. — to a 6-digit hex string, so callers never
 * need their own color-space math. Two browser round-trips do the work: a
 * hidden probe element resolves `var(--token)` references via computed
 * style (which itself may still be `oklch(...)` in modern browsers, not
 * `rgb(...)`), then a 1x1 canvas — whose pixel buffer is always concrete
 * 8-bit sRGB regardless of the color space used to paint it — reads back
 * the final bytes. Falls back to `fallback` outside the browser.
 */
export function resolveCssColorToHex(color: string, fallback = '#000000'): string {
  const trimmed = color.trim();
  if (isHexColor(trimmed)) {
    return normalizeHex(trimmed);
  }

  const probe = getProbeElement();
  const ctx = getCanvasContext();
  if (!probe || !ctx) return fallback;

  probe.style.color = '';
  probe.style.color = trimmed;
  const resolved = getComputedStyle(probe).color;

  ctx.fillStyle = '#000000';
  ctx.fillStyle = resolved;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return `#${channelToHex(r)}${channelToHex(g)}${channelToHex(b)}`;
}
