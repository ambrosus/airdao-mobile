import React, { forwardRef } from 'react';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { verticalScale } from '@utils/scaling';
import { DEVICE_HEIGHT } from '@constants/variables';
import { useTranslation } from 'react-i18next';
import { BridgeSelectorItem } from '../../BridgeSelectorItem';
import { useBridgeContextData } from '@contexts/Bridge';
import { FlatList } from 'react-native';
import { RenderTokenItem } from '@models/Bridge';

interface BottomSheetChoseNetworksProps {
  onPressItem: (item: any) => void;
  selectorType: 'network' | 'token';
  destination?: 'from' | 'to';
}

export const BottomSheetBridgeItemSelector = forwardRef<
  BottomSheetRef,
  BottomSheetChoseNetworksProps
>((props, ref) => {
  const { onPressItem, destination, selectorType } = props;

  const isNetworkSelector = selectorType === 'network';
  const isFrom = selectorType && destination === 'from';

  const { bridges, networksParams, tokenParams, fromParams, toParams } =
    useBridgeContextData();

  const pickerData = isFrom ? fromParams : toParams;

  const { t } = useTranslation();
  const header = t(
    isNetworkSelector ? 'bridge.select.network' : 'bridge.select.assets'
  );

  const renderNetworkItem = (network: any) => {
    const { item } = network;
    return (
      <BridgeSelectorItem
        symbol={item.id}
        name={item.name}
        isActive={pickerData.value.id === item.id}
        onPressItem={onPressItem}
        key={item.id}
        item={item}
      />
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
        onPressItem={onPressItem}
        key={item.renderTokenItem?.name}
        item={item}
      />
    );
  };

  const activeArray = isNetworkSelector ? bridges : networksParams;
  return (
    <BottomSheet
      ref={ref}
      height={DEVICE_HEIGHT * 0.45}
      swiperIconVisible={true}
    >
      <Spacer value={verticalScale(16)} />
      <Text
        fontSize={18}
        fontFamily="Inter_700Bold"
        color={COLORS.neutral800}
        align="center"
      >
        {header}
      </Text>
      <Spacer value={verticalScale(16)} />
      <FlatList
        // @ts-ignore
        data={activeArray}
        renderItem={isNetworkSelector ? renderNetworkItem : renderTokenItem}
      />
      <Spacer value={verticalScale(30)} />
    </BottomSheet>
  );
});
