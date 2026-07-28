import { AnimationName } from "../types/tailwind.js";

export interface AnimationProps {
  animation?: AnimationName | {
    name: AnimationName;
    delay?: '1s' | '2s' | '3s' | '4s' | '5s' | number;
    duration?: 'slow' | 'slower' | 'fast' | 'faster' | number;
    infinite?: boolean;
    repeat?: 1 | 2 | 3 | number;
  };
}