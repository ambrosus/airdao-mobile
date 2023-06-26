import React, { memo } from 'react';
import { LayoutChangeEvent, View, ViewStyle } from 'react-native';

type Props = {
  value?: number;
  horizontal?: boolean;
  flexBasis?: string | number;
  flexShrink?: number;
  flexGrow?: number;
  pointerEvents?: 'box-none' | 'none' | 'box-only' | 'auto';
  onLayout?: (event: LayoutChangeEvent) => void;
  testID?: string;
  style?: ViewStyle;
};

export const Spacer = memo(
  ({
    value,
    flexBasis,
    flexShrink,
    flexGrow,
    horizontal,
    pointerEvents,
    style,
    onLayout: handleLayout
  }: Props) => {
    return (
      <View
        onLayout={handleLayout}
        style={[
          {
            height: horizontal ? undefined : value,
            width: horizontal ? value : undefined,
            flexBasis,
            flexShrink,
            flexGrow
          },
          style
        ]}
        pointerEvents={pointerEvents}
      />
    );
  }
);
