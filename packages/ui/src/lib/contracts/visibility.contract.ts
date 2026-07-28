export type OpacityValue = 0 | 5 | 10 | 20 | 25 | 30 | 40 | 50 | 60 | 70 | 75 | 80 | 90 | 95 | 100;
export type PointerEvents = 'none' | 'auto';

export interface VisibilityProps {
  hidden?: boolean;
  srOnly?: boolean;
  opacity?: OpacityValue;
  pointerEvents?: PointerEvents;
}