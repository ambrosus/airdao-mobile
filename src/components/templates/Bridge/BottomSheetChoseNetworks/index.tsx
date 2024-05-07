import React, { forwardRef } from 'react';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { verticalScale } from '@utils/scaling';
import { DEVICE_HEIGHT } from '@constants/variables';
import { useTranslation } from 'react-i18next';
import { BridgeSelectorItem } from '../../BridgeSelectorItem';
import { useBridgeContextSelector } from '@contexts/Bridge';
import { ParsedBridge } from '@models/Bridge';

interface BottomSheetChoseNetworksProps {
  onPressItem: (item: ParsedBridge) => void;
  destination: 'from' | 'to';
}

export const BottomSheetChoseNetworks = forwardRef<
  BottomSheetRef,
  BottomSheetChoseNetworksProps
>((props, ref) => {
  const { onPressItem, destination } = props;
  const isFrom = destination === 'from';

  const { bridges, fromParams, toParams } = useBridgeContextSelector();

  const pickerData = isFrom ? fromParams : toParams;

  // console.log('pickerData', pickerData);

  const { t } = useTranslation();

  return (
    <BottomSheet
      ref={ref}
      height={DEVICE_HEIGHT * 0.4}
      swiperIconVisible={true}
    >
      <Spacer value={verticalScale(24)} />
      <Text
        fontSize={18}
        fontFamily="Inter_700Bold"
        color={COLORS.neutral800}
        align="center"
      >
        {t('bridge.select.network')}
      </Text>
      <Spacer value={verticalScale(24)} />
      <Spacer value={verticalScale(15)} />
      {bridges.map((item) => (
        <BridgeSelectorItem
          symbol={item.id}
          name={item.name}
          isActive={pickerData.value.id === item.id}
          // @ts-ignore
          onPressItem={onPressItem}
          key={item.id}
          item={item}
        />
      ))}
      <Spacer value={verticalScale(30)} />
    </BottomSheet>
  );
});
