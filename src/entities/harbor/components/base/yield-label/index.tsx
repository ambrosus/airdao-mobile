import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { styles } from './styles';

const Triangle = ({ style }: { style?: StyleProp<ViewStyle> }) => {
  return (
    <View style={style}>
      <Svg width="26" height="9" viewBox="0 0 26 9" fill="none">
        <Path
          d="M11.5856 7.7099C12.3666 8.49095 13.633 8.49095 14.414 7.7099L19.7807 2.34325C21.281 0.84296 23.3158 0.000105669 25.4375 0.000102692L25.4999 0.000102718L12.5966 0.000102044L0.499937 -6.31717e-05L0.562332 -5.91125e-05C2.68392 4.57357e-05 4.71859 0.842892 6.21879 2.34309L11.5856 7.7099Z"
          fill="#574CFF"
          fillOpacity="0.16"
        />
      </Svg>
    </View>
  );
};

export const YieldLabel = ({ label }: { label: string }) => {
  return (
    <>
      <View style={styles.container}>
        <Text
          fontSize={14}
          fontFamily="Inter_500Medium"
          color={COLORS.brand600}
          numberOfLines={2}
        >
          {label}
        </Text>
      </View>
      <Triangle style={styles.triangleContainer} />
    </>
  );
};
