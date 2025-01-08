import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Spacer, Text } from '@components/base';
import { EmptyAddressListPlaceholderIcon } from '@components/svg/icons';
import { styles } from '@components/templates/LocalizedRenderEmpty/styles';
import { COLORS } from '@constants/colors';
import { verticalScale } from '@utils';

type LocalizedRenderEmptyProps = {
  text: string;
  icon?: React.ReactNode;
};

export const LocalizedRenderEmpty = ({
  text,
  icon
}: LocalizedRenderEmptyProps) => {
  const { t } = useTranslation();
  return (
    <View testID="empty-list" style={styles.emptyContainer}>
      {icon || <EmptyAddressListPlaceholderIcon />}
      <Spacer value={verticalScale(16)} />
      <Text
        align="center"
        fontFamily="Inter_400Regular"
        fontSize={15}
        color={COLORS.neutral500}
      >
        {t(text)}
      </Text>
    </View>
  );
};
