import { ColorableProps, ColorValue } from "../contracts/color.contract.js";

const resolveSingleColor = (prefix: string, value?: ColorValue): string => {
  if (!value) return '';
  if (typeof value === 'string') {
    return `${prefix}-${value}`;
  }
  if ('token' in value) {
    return `${prefix}-${value.token}`;
  }
  const intensity = value.intensity ? `-${value.intensity}` : '-500';
  return `${prefix}-${value.color}${intensity}`;
};

export const resolveColor = (props: ColorableProps): string[] => {
  const classes: string[] = [];
  if (props.textColor) classes.push(resolveSingleColor('text', props.textColor));
  if (props.backgroundColor) classes.push(resolveSingleColor('bg', props.backgroundColor));
  if (props.borderColor) classes.push(resolveSingleColor('border', props.borderColor));
  if (props.ringColor) classes.push(resolveSingleColor('ring', props.ringColor));
  return classes.filter(Boolean);
};