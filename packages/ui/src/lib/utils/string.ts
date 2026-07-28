export const formatArbitrary = (value: unknown): string => {
  if (typeof value === 'number') return `${value}`;
  if (typeof value === 'string') {
    if (value.startsWith('[') && value.endsWith(']')) return value;
    return value;
  }
  return String(value);
};