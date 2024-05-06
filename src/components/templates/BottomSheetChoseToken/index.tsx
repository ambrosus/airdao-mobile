import React, { forwardRef } from 'react';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { verticalScale } from '@utils/scaling';
import { DEVICE_HEIGHT } from '@constants/variables';
import { useTranslation } from 'react-i18next';
import { RenderTokenItem } from '@models/Bridge';

interface BottomSheetChoseNetworksProps {
  onPressItem: () => void;
  renderData?: RenderTokenItem[];
}

export const BottomSheetChoseToken = forwardRef<
  BottomSheetRef,
  BottomSheetChoseNetworksProps
>((props, ref) => {
  const { renderData } = props;
  const { t } = useTranslation();

  // console.log('!!', renderData);

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
      {renderData?.map((item) => (
        <Text key={item.renderTokenItem.name}>
          {item.renderTokenItem.symbol}
        </Text>
      ))}
      <Spacer value={verticalScale(30)} />
    </BottomSheet>
  );
});
