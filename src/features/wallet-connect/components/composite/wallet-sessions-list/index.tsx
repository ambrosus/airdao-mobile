import React, { useCallback, useMemo } from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  StyleProp,
  View,
  ViewStyle
} from 'react-native';
import { SessionTypes } from '@walletconnect/types';
import { useWalletConnectContextSelector } from '@features/wallet-connect/lib/hooks';
import { scale } from '@utils';
import { WalletSessionItem } from '../../base';

export const WalletSessionsList = () => {
  const { activeSessions } = useWalletConnectContextSelector();

  const renderWalletSessionListItem = useCallback(
    (args: ListRenderItemInfo<SessionTypes.Struct>) => {
      const { item: connection, index } = args;
      return <WalletSessionItem connection={connection} index={index} />;
    },
    []
  );

  const containerStyles: StyleProp<ViewStyle> = useMemo(() => {
    return {
      maxHeight: 320
    };
  }, []);

  const contentContainerListStyles: StyleProp<ViewStyle> = useMemo(() => {
    return {
      flexGrow: 1,
      rowGap: 16,
      paddingHorizontal: scale(16)
    };
  }, []);

  return (
    <View style={containerStyles}>
      <FlatList
        contentContainerStyle={contentContainerListStyles}
        keyExtractor={(item) => item.pairingTopic + Math.random()}
        data={activeSessions}
        renderItem={renderWalletSessionListItem}
      />
    </View>
  );
};
