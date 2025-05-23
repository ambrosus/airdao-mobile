import { useMemo } from 'react';
import { DimensionValue, StyleProp, View, ViewStyle } from 'react-native';
import { Spinner } from '@components/base';

interface ScreenLoaderProps {
  readonly height?: DimensionValue;
}

export const ScreenLoader = ({ height = '75%' }: ScreenLoaderProps) => {
  const containerStyle: StyleProp<ViewStyle> = useMemo(() => {
    return {
      height,
      justifyContent: 'center',
      alignItems: 'center'
    };
  }, [height]);

  return (
    <View style={containerStyle}>
      <Spinner />
    </View>
  );
};
