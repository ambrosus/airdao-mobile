import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Spacer, Text } from '@components/base';
import { scale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { styles } from '@screens/Wallets/components/HomeHighlightsSlider/styles';

type Props = {
  item: { name: string; time: string };
};
export const HighlightItem = ({ item }: Props) => {
  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.image}></View>
      <Spacer value={scale(16)} />
      <Text
        fontFamily="Inter_600SemiBold"
        fontSize={14}
        color={COLORS.smokyBlack}
        style={{ maxWidth: 180 }}
      >
        {item.name}
      </Text>
      <Spacer value={scale(8)} />
      <Text
        fontFamily="Inter_500Medium"
        fontSize={12}
        color={COLORS.smokyBlack}
      >
        {item.time}
      </Text>
    </TouchableOpacity>
  );
};
