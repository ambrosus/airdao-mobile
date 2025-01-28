import { View, ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { verticalScale } from '@utils';

export const BottomAwareSafeAreaView = (
  props: ViewProps & { paddingBottom?: number }
) => {
  const { bottom } = useSafeAreaInsets();
  return (
    <View
      {...props}
      style={[
        props.style,
        {
          paddingBottom: Math.max(
            // @ts-ignore
            (props.paddingBottom || verticalScale(16)) - bottom,
            0
          )
        }
      ]}
    />
  );
};
