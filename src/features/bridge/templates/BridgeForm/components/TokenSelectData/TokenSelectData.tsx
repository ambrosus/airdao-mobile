import { forwardRef } from 'react';
import { FlatList, View } from 'react-native';
import { formatUnits } from 'ethers/lib/utils';
import { Spacer, Text } from '@components/base';
import { BottomSheetRef } from '@components/composite';
import { BridgeSelectorItem } from '@components/templates/BridgeSelectorItem';
import { COLORS } from '@constants/colors';
import { DECIMAL_LIMIT } from '@constants/variables';
import { useBridgeContextData } from '@features/bridge/context';
import { Token } from '@lib/bridgeSDK/models/types';
import { RenderTokenItem } from '@models/Bridge';
import { scale, NumberUtils } from '@utils';
import { styles } from './styles';

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
        {NumberUtils.numberToTransformedLocale(tokenBalanceInfo)}
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
      <Spacer value={scale(50)} />
    </View>
  );
});
