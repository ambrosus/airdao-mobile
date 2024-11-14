import React from 'react';
import { View } from 'react-native';
import { InfoIcon } from '@components/svg/icons';
import { Spacer } from '@components/base';
import { Text } from '@components//base';
import { useTranslation } from 'react-i18next';
import { COLORS } from '@constants/colors';
import { scale } from '@utils/scaling';

export const ErrorTemplate = () => {
  const { t } = useTranslation();

  return (
    <View style={{ alignItems: 'center' }}>
      <Spacer value={30} />
      <InfoIcon />
      <Spacer value={10} />
      <Text color={COLORS.neutral800} fontSize={scale(18)}>
        {t('bridge.unknown.error')}
      </Text>
      <Spacer value={10} />
      <Text fontSize={scale(16)}>{t('common.please.try.again')}</Text>
      <Spacer value={90} />
    </View>
  );
};
