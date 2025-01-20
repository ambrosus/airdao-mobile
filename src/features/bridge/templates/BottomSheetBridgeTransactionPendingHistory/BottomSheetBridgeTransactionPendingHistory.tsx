import React, { forwardRef } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Spacer, Text } from '@components/base';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { PrimaryButton } from '@components/modular';
import { COLORS } from '@constants/colors';
import { BridgeTransactionPendingTemplate } from '@features/bridge/templates/BottomSheetBridgeTransactionPendingHistory/components';
import { BridgeTransactionHistoryDTO } from '@models/dtos/Bridge';
import { verticalScale } from '@utils';
import { styles } from './styles';

interface BottomSheetBridgeTransactionPendingHistoryProps {
  transaction: BridgeTransactionHistoryDTO;
  buttonType?: 'done' | 'share';
  liveTransactionInformation: {
    stage: string;
    confirmations: {
      current: number;
      minSafetyBlocks: number;
    };
  };
}

export const BottomSheetBridgeTransactionPendingHistory = forwardRef<
  BottomSheetRef,
  BottomSheetBridgeTransactionPendingHistoryProps
>(({ transaction, liveTransactionInformation, buttonType }, bottomSheetRef) => {
  const { t } = useTranslation();
  const isDoneBtn = buttonType === 'done';

  const onButtonPress = () => {
    if (isDoneBtn) {
      // @ts-ignore
      bottomSheetRef?.current?.dismiss();
    }
  };

  return (
    <BottomSheet ref={bottomSheetRef} swiperIconVisible>
      <Spacer value={verticalScale(16)} />
      <View style={styles.stepWrapper}>
        <BridgeTransactionPendingTemplate
          transaction={transaction}
          liveTransactionInformation={liveTransactionInformation}
        />
      </View>
      {!!buttonType && (
        <PrimaryButton onPress={onButtonPress}>
          <Text
            fontFamily="Inter_600SemiBold"
            color={COLORS.neutral0}
            fontSize={16}
          >
            {isDoneBtn ? t('common.done') : t('button.share')}
          </Text>
        </PrimaryButton>
      )}
      <Spacer value={verticalScale(36)} />
    </BottomSheet>
  );
});
