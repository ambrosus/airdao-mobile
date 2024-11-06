import React, { forwardRef } from 'react';
import { BottomSheetRef } from '@components/composite';
import { Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { scale } from '@utils/scaling';
import { useBridgeContextData } from '@features/bridge/context';
import { FlatList, View } from 'react-native';
import { RenderTokenItem } from '@models/Bridge';
import { BridgeSelectorItem } from '@components/templates/BridgeSelectorItem';
import { styles } from './styles';
import { formatUnits } from 'ethers/lib/utils';
import { NumberUtils } from '@utils/number';
import { DECIMAL_LIMIT } from '@constants/variables';

interface BottomSheetChoseNetworksProps {
  onPressItem: (item: any) => void;
}

export const TokenSelectData = forwardRef<
  BottomSheetRef,
  BottomSheetChoseNetworksProps
>((props) => {
  const { onPressItem } = props;

  const { networksParams, tokenParams } = useBridgeContextData();
  const TokenBalance = ({ token }: { token: RenderTokenItem }) => {
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
    return (
      <BridgeSelectorItem
        symbol={item.renderTokenItem.symbol}
        name={item.renderTokenItem.name}
        isActive={
          tokenParams?.value?.renderTokenItem?.name ===
          item.renderTokenItem.name
        }
        rightContent={<TokenBalance token={item.renderTokenItem} />}
        onPressItem={onPressItem}
        key={item.renderTokenItem?.name}
        item={item}
      />
    );
  };

  return (
    <View>
      <FlatList
        contentContainerStyle={styles.listContainer}
        // @ts-ignore
        data={networksParams}
        renderItem={renderTokenItem}
      />
    </View>
  );
});
