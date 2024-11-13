import React from 'react';
import { COLORS } from '@constants/colors';
import { GradientButton, GradientButtonProps } from './Gradient';

export const PrimaryButton = (props: GradientButtonProps) => {
  const {
    shadowEnable = false,
    CSSShadowProperty = '0px 0px 12px 0px rgba(53, 104, 221, 0.50)',
    colors = props.disabled
      ? [COLORS.primary50, COLORS.primary50]
      : [COLORS.brand600, COLORS.brand600],
    start = { x: 0.5, y: 0 },
    end = { x: 0.5, y: 1 },
    locations = [0, 1],
    ...restProps
  } = props;

  return (
    <GradientButton
      {...restProps}
      shadowEnable={shadowEnable}
      CSSShadowProperty={CSSShadowProperty}
      colors={colors}
      start={start}
      end={end}
      locations={locations}
    />
  );
};
