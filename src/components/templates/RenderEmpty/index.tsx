import { View } from 'react-native';
import { EmptyWalletListPlaceholderIcon } from '@components/svg/icons';
import { Spacer, Text } from '@components/base';
import { verticalScale } from '@utils/scaling';
import React from 'react';
import { styles } from '@components/templates/RenderEmpty/styles';

type RenderEmptyProps = {
  text: string;
};

export const RenderEmpty = ({ text }: RenderEmptyProps) => {
  return (
    <View testID="empty-list" style={styles.emptyContainer}>
      <EmptyWalletListPlaceholderIcon />
      <Spacer value={verticalScale(16)} />
      <Text fontFamily="Inter_400Regular" fontSize={15} color="#51545a">
        No {text} yet
      </Text>
    </View>
  );
};
