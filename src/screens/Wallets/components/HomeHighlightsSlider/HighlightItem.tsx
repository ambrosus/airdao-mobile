import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Spacer, Text } from '@components/base';
import { scale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';

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

const styles = StyleSheet.create({
  container: {
    marginVertical: verticalScale(24),
    marginHorizontal: scale(18)
  },
  image: {
    backgroundColor: '#d9d9d9',
    borderRadius: 8,
    width: 180,
    height: 160,
    alignItems: 'center'
  }
});
