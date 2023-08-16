import React from 'react';
import { View } from 'react-native';
import { EmptyWalletListPlaceholderIcon } from '@components/svg/icons';
import { Spacer, Text } from '@components/base';
import { verticalScale } from '@utils/scaling';
import { styles } from '@components/templates/LocalizedRenderEmpty/styles';
import { useTranslation } from 'react-i18next';

type LocalizedRenderEmptyProps = {
  text: string;
};

export const LocalizedRenderEmpty = ({ text }: LocalizedRenderEmptyProps) => {
  const { t } = useTranslation();
  return (
    <View testID="empty-list" style={styles.emptyContainer}>
      <EmptyWalletListPlaceholderIcon />
      <Spacer value={verticalScale(16)} />
      <Text fontFamily="Inter_400Regular" fontSize={15} color="#51545a">
        {t(text)}
      </Text>
    </View>
  );
};
