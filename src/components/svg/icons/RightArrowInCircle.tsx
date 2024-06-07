import { StyleSheet, View } from 'react-native';
import { RightArrowIcon } from '@components/svg/icons/RightArrow';
import { COLORS } from '@constants/colors';
import React from 'react';
import { scale } from '@utils/scaling';

export const RightArrowInCircle = () => {
  return (
    <View style={styles.reorder}>
      <RightArrowIcon color={COLORS.black} scale={1.4} />
    </View>
  );
};

const styles = StyleSheet.create({
  reorder: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(40),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.neutral100,
    top: 10
  }
});
