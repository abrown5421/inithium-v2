export type AnimateEntry = 
  | 'backInDown' | 'backInLeft' | 'backInRight' | 'backInUp'
  | 'bounceIn' | 'bounceInDown' | 'bounceInLeft' | 'bounceInRight' | 'bounceInUp'
  | 'fadeIn' | 'fadeInDown' | 'fadeInLeft' | 'fadeInRight' | 'fadeInUp'
  | 'flipInX' | 'flipInY'
  | 'lightSpeedInLeft' | 'lightSpeedInRight'
  | 'rotateIn' | 'rotateInDownLeft' | 'rotateInDownRight' | 'rotateInUpLeft' | 'rotateInUpRight'
  | 'zoomIn' | 'zoomInDown' | 'zoomInLeft' | 'zoomInRight' | 'zoomInUp'
  | 'slideInDown' | 'slideInLeft' | 'slideInRight' | 'slideInUp';

export type AnimateExit = 
  | 'backOutDown' | 'backOutLeft' | 'backOutRight' | 'backOutUp'
  | 'bounceOut' | 'bounceOutDown' | 'bounceOutLeft' | 'bounceOutRight' | 'bounceOutUp'
  | 'fadeOut' | 'fadeOutDown' | 'fadeOutLeft' | 'fadeOutRight' | 'fadeOutUp'
  | 'fadeOutTopLeft' | 'fadeOutTopRight' | 'fadeOutBottomLeft' | 'fadeOutBottomRight'
  | 'flipOutX' | 'flipOutY'
  | 'lightSpeedOutLeft' | 'lightSpeedOutRight'
  | 'rotateOut' | 'rotateOutDownLeft' | 'rotateOutDownRight' | 'rotateOutUpLeft' | 'rotateOutUpRight'
  | 'zoomOut' | 'zoomOutDown' | 'zoomOutLeft' | 'zoomOutRight' | 'zoomOutUp'
  | 'slideOutDown' | 'slideOutLeft' | 'slideOutRight' | 'slideOutUp'
  | 'hinge' | 'rollOut';

export type AnimationTiming = 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';

export interface AnimationConfig {
  readonly entry?: AnimateEntry;
  readonly exit?: AnimateExit;
  readonly duration?: number;
  readonly delay?: number;
  readonly timing?: AnimationTiming;
}

export interface TransitionState {
  readonly isMounted: boolean;
  readonly isAnimating: boolean;
  readonly stage: 'entering' | 'entered' | 'exiting' | 'exited';
}