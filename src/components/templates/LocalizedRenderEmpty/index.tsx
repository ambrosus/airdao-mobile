import React from 'react';
import { View } from 'react-native';
import { EmptyAddressListPlaceholderIcon } from '@components/svg/icons';
import { Spacer, Text } from '@components/base';
import { verticalScale } from '@utils/scaling';
import { styles } from '@components/templates/LocalizedRenderEmpty/styles';
import { useTranslation } from 'react-i18next';
import { COLORS } from '@constants/colors';

type LocalizedRenderEmptyProps = {
  text: string;
};

export const LocalizedRenderEmpty = ({ text }: LocalizedRenderEmptyProps) => {
  const { t } = useTranslation();
  return (
    <View testID="empty-list" style={styles.emptyContainer}>
      <EmptyAddressListPlaceholderIcon />
      <Spacer value={verticalScale(16)} />
      <Text
        fontFamily="Inter_400Regular"
        fontSize={15}
        color={COLORS.neutral500}
      >
        {t(text)}
      </Text>
    </View>
  );
};
