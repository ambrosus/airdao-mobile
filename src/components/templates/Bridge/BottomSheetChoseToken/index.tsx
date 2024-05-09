import React, { forwardRef, RefObject } from 'react';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { verticalScale } from '@utils/scaling';
import { DEVICE_HEIGHT } from '@constants/variables';
import { useTranslation } from 'react-i18next';
import { ParsedBridge, RenderTokenItem } from '@models/Bridge';
import { BridgeSelectorItem } from '@components/templates/BridgeSelectorItem';
import { ScrollView } from 'react-native';
import { useBridgeContextSelector } from '@contexts/Bridge';

interface BottomSheetChoseNetworksProps {
  ref: RefObject<BottomSheetRef>;
  onPressItem: (item: ParsedBridge | RenderTokenItem) => void;
  renderData?: RenderTokenItem[];
}

export const BottomSheetChoseToken = forwardRef<
  BottomSheetRef,
  BottomSheetChoseNetworksProps
>((props, ref) => {
  const { renderData, onPressItem } = props;
  const { t } = useTranslation();
  const { tokenParams } = useBridgeContextSelector();
  // console.log(tokenParams.value);
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
        {t('bridge.select.token')}
      </Text>
      <Spacer value={verticalScale(24)} />
      <Spacer value={verticalScale(15)} />
      <ScrollView>
        {renderData?.map((item) => (
          <BridgeSelectorItem
            symbol={item.renderTokenItem.symbol}
            name={item.renderTokenItem.name}
            isActive={
              tokenParams.value.renderTokenItem.name ===
              item.renderTokenItem.name
            }
            onPressItem={onPressItem}
            key={item.renderTokenItem.name}
            item={item}
          />
        ))}
      </ScrollView>
      <Spacer value={verticalScale(30)} />
    </BottomSheet>
  );
});
