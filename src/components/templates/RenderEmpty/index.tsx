import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Spacer, Text } from '@components/base';
import { EmptyWalletListPlaceholderIcon } from '@components/svg/icons';
import { styles } from '@components/templates/LocalizedRenderEmpty/styles';
import { verticalScale } from '@utils';

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
