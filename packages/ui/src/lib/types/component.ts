import { AnimationProps } from "../contracts/animation.contract.js";
import { BorderProps } from "../contracts/border.contract.js";
import { ColorableProps } from "../contracts/color.contract.js";
import { LayoutProps } from "../contracts/layout.contract.js";
import { PositionProps } from "../contracts/position.contract.js";
import { SizeProps } from "../contracts/size.contract.js";
import { SpacingProps } from "../contracts/spacing.contract.js";
import { StateProps } from "../contracts/state.contract.js";
import { TypographyProps } from "../contracts/typography.contract.js";
import { VisibilityProps } from "../contracts/visibility.contract.js";

export interface InithiumBaseProps
  extends ColorableProps,
    AnimationProps,
    SpacingProps,
    BorderProps,
    TypographyProps,
    LayoutProps,
    SizeProps,
    PositionProps,
    StateProps,
    VisibilityProps {
  className?: string;
}