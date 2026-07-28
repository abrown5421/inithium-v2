export type ResponsiveProp<T> = T | {
  initial?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
};

export type StatePrefix<T extends string> = T | {
  base?: T;
  hover?: T;
  focus?: T;
  active?: T;
  disabled?: T;
};