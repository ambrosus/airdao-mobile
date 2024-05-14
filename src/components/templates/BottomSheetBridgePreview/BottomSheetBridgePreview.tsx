import React, { forwardRef, RefObject } from 'react';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils/scaling';
import { DEVICE_HEIGHT } from '@constants/variables';
import { useTranslation } from 'react-i18next';
import { PrimaryButton } from '@components/modular';
import { View } from 'react-native';

interface DataToPreviewModel {
  name: string;
  cryptoAmount?: number | string;
  usdAmount?: number | string;
  symbol: string;
}

interface BottomSheetChoseNetworksProps {
  ref: RefObject<BottomSheetRef>;
  onAcceptPress: () => void;
  dataToPreview: DataToPreviewModel[];
}

export const BottomSheetBridgePreview = forwardRef<
  BottomSheetRef,
  BottomSheetChoseNetworksProps
>((props, ref) => {
  const { t } = useTranslation();
  const { onAcceptPress, dataToPreview } = props;

  return (
    <BottomSheet
      ref={ref}
      height={DEVICE_HEIGHT * 0.44}
      swiperIconVisible={true}
    >
      <View style={{ marginHorizontal: scale(24) }}>
        <Spacer value={verticalScale(24)} />
        <Text
          fontSize={18}
          fontFamily="Inter_700Bold"
          color={COLORS.neutral800}
          align="center"
        >
          {t('bridge.preview.title')}
        </Text>
        <Spacer value={verticalScale(24)} />
        <View>
          {dataToPreview.map((item) => (
            <>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }}
              >
                <Text>{item.name}</Text>
                <Text>
                  <Text>{`${item.cryptoAmount}  ${item.symbol}`}</Text>{' '}
                  {!!item.usdAmount && <Text>{`$${item.usdAmount}`}</Text>}
                </Text>
              </View>
              <Spacer value={scale(16)} />
            </>
          ))}
        </View>
        <Spacer value={verticalScale(15)} />
        <PrimaryButton onPress={onAcceptPress}>
          <Text
            fontFamily="Inter_600SemiBold"
            color={COLORS.neutral0}
            fontSize={16}
          >
            {t('bridge.preview.button')}
          </Text>
        </PrimaryButton>
      </View>
    </BottomSheet>
  );
});
