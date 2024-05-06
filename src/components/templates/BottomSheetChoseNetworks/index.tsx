import React, { forwardRef } from 'react';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { verticalScale } from '@utils/scaling';
import { DEVICE_HEIGHT } from '@constants/variables';
import { useTranslation } from 'react-i18next';
import { BridgeItem } from './components/BridgeItem';
import { useBridgeContextSelector } from '@contexts/Bridge';
import { ParsedBridge } from '@models/Bridge';

interface BottomSheetChoseNetworksProps {
  onPressItem: (bridge: ParsedBridge) => void;
  pickerData: { value: ParsedBridge; setter: (value: any) => void };
}

export const BottomSheetChoseNetworks = forwardRef<
  BottomSheetRef,
  BottomSheetChoseNetworksProps
>((props, ref) => {
  const { onPressItem } = props;

  const { bridges } = useBridgeContextSelector();

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
        <BridgeItem onPressItem={onPressItem} key={item.id} bridge={item} />
      ))}
      <Spacer value={verticalScale(30)} />
    </BottomSheet>
  );
});
