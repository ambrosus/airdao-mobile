import React, { forwardRef } from 'react';
import { BottomSheetRef } from '@components/composite';
import { useBridgeContextData } from '@features/bridge/context';
import { FlatList, View } from 'react-native';
import { RenderTokenItem } from '@models/Bridge';
import { styles } from './styles';
import { BridgeSelectorItem } from '@components/templates/BridgeSelectorItem';
import { NumberUtils } from '@utils/number';
import { formatUnits } from 'ethers/lib/utils';
import { DECIMAL_LIMIT } from '@constants/variables';
import { Text } from '@components/base';
import { scale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { Token } from '@lib/bridgeSDK/models/types';

interface BottomSheetChoseNetworksProps {
  onPressItem: (item: any) => void;
}

export const TokenSelectData = forwardRef<
  BottomSheetRef,
  BottomSheetChoseNetworksProps
>((props) => {
  const { onPressItem } = props;

  const { variables } = useBridgeContextData();
  const { selectedBridgeData, selectedTokenPairs } = variables;
  const TokenBalance = ({ token }: { token: Token }) => {
    const balance = NumberUtils.limitDecimalCount(
      formatUnits(token.balance || 0, token.decimals),
      DECIMAL_LIMIT.CRYPTO
    );
    const tokenBalanceInfo = `${balance} ${token.symbol}`;
    return (
      <Text fontSize={scale(14)} color={COLORS.black}>
        {tokenBalanceInfo}
      </Text>
    );
  };

  const renderTokenItem = (token: any) => {
    const { item }: { item: RenderTokenItem } = token;
    // @ts-ignore
    const renderToken = item[0];
    // @ts-ignore
    const selectedTokenItem = selectedTokenPairs[0];
    return (
      <BridgeSelectorItem
        symbol={renderToken.symbol}
        name={renderToken.name}
        isActive={renderToken.name === selectedTokenItem.name}
        rightContent={<TokenBalance token={renderToken} />}
        onPressItem={onPressItem}
        key={renderToken.name}
        item={item}
      />
    );
  };

  return (
    <View>
      <FlatList
        contentContainerStyle={styles.listContainer}
        // @ts-ignore
        data={selectedBridgeData.pairs}
        renderItem={renderTokenItem}
      />
    </View>
  );
});
