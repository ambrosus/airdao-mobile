import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils/scaling';

export const UseMax = () => {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Text
        color={COLORS.neutral900}
        fontSize={14}
        fontFamily="Inter_500Medium"
        fontWeight="500"
      >
        {t('send.funds.use.max')}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.alphaBlack5,
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(6),
    borderRadius: 1000,
    alignSelf: 'baseline'
  }
});
