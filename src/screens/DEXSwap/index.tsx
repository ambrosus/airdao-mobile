import React, { useCallback, useMemo } from 'react';
import { FlatList, StyleProp, TouchableOpacity, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@components/base';
import { DEXSwapInterfaceService } from '@features/dex-swap-interface';
import { useBridgeContextSelector } from '@contexts/Bridge';
import Config from '@constants/config';

export const DEXSwapScreen = () => {
  const { selectedAccount } = useBridgeContextSelector();

  const containerStyle: StyleProp<ViewStyle> = useMemo(() => {
    return {
      flex: 1,
      paddingHorizontal: 20
    };
  }, []);

  const renderItem = useCallback(
    (args: any) => {
      const balance = async () => {
        return await DEXSwapInterfaceService.balanceOf({
          token: args.item,
          ownerAddress: selectedAccount?.address ?? ''
        });
      };

      return (
        <TouchableOpacity onPress={balance}>
          <Text>{args.item.name}</Text>
        </TouchableOpacity>
      );
    },
    [selectedAccount?.address]
  );

  return (
    <SafeAreaView style={containerStyle}>
      <Text>Swap</Text>

      <FlatList data={Config.DEX_SUPPORTED_TOKENS} renderItem={renderItem} />
      {/* <CurrencySelect /> */}
    </SafeAreaView>
  );
};
