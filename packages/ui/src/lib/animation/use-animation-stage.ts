import { useState, useEffect } from 'react';
import { AnimationConfig, TransitionState } from '@inithium/types';
import { DEFAULT_ANIMATION_CONFIG } from './animation.constants.js';

export const useAnimationStage = (
  isVisible: boolean,
  config: AnimationConfig = {}
): TransitionState => {
  const { duration, delay } = { ...DEFAULT_ANIMATION_CONFIG, ...config };
  const [state, setState] = useState<TransitionState>({
    isMounted: isVisible,
    isAnimating: false,
    stage: isVisible ? 'entered' : 'exited',
  });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isVisible) {
      setState({ isMounted: true, isAnimating: true, stage: 'entering' });
      timeoutId = setTimeout(() => {
        setState({ isMounted: true, isAnimating: false, stage: 'entered' });
      }, duration + delay);
    } else {
      setState((prev) => ({ ...prev, isAnimating: true, stage: 'exiting' }));
      timeoutId = setTimeout(() => {
        setState({ isMounted: false, isAnimating: false, stage: 'exited' });
      }, duration);
    }

    return () => clearTimeout(timeoutId);
  }, [isVisible, duration, delay]);

  return state;
};