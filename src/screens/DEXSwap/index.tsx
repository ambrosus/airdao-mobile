import React, { useCallback, useMemo } from 'react';
import { FlatList, StyleProp, TouchableOpacity, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@components/base';
import { DEXSwapInterfaceService } from '@features/dex-swap-interface';
import { DEFAULT_TOKEN_LIST } from '@features/dex-swap-interface/entities/tokens';
import { useBridgeContextSelector } from '@contexts/Bridge';

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

        // console.log(
        //   NumberUtils.limitDecimalCount(formatEther(_balance?._hex), 2) || ''
        // );
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

      <FlatList data={DEFAULT_TOKEN_LIST.tokens} renderItem={renderItem} />
      {/* <CurrencySelect /> */}
    </SafeAreaView>
  );
};
