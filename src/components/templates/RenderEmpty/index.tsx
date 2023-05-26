import { View } from 'react-native';
import { EmptyWalletListPlaceholderIcon } from '@components/svg/icons';
import { Spacer, Text } from '@components/base';
import { verticalScale } from '@utils/scaling';
import React from 'react';
import { styles } from '@components/templates/RenderEmpty/styles';

type RenderEmptyProps = {
  title: string;
};

export const RenderEmpty = ({ title }: RenderEmptyProps) => {
  return (
    <View testID="Empty_Item" style={styles.emptyContainer}>
      <EmptyWalletListPlaceholderIcon testID="Empty_WalletList_Placeholder_Icon" />
      <Spacer value={verticalScale(16)} />
      <Text fontFamily="Inter_400Regular" fontSize={15} color="#51545a">
        No {title} yet
      </Text>
    </View>
  );
};
