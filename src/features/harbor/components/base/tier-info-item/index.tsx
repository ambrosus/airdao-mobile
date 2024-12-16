import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { scale } from '@utils/scaling';
import { styles } from './styles';

interface TierInfoItemProps {
  header: string;
  content: string;
}

export const TierInfoItem = ({ header, content }: TierInfoItemProps) => {
  const { t } = useTranslation();
  return (
    <View style={styles.main}>
      <Text
        fontSize={scale(14)}
        fontFamily="Inter_500Medium"
        color={COLORS.neutral900}
        align="left"
      >
        {t(header)}
      </Text>
      <Spacer value={scale(8)} />
      <Text
        fontSize={scale(12)}
        fontFamily="Inter_500Medium"
        color={COLORS.neutral600}
      >
        {t(content)}
      </Text>
    </View>
  );
};
