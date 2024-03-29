import React, { ForwardedRef, forwardRef } from 'react';
import {
  BottomSheet,
  BottomSheetProps,
  BottomSheetRef,
  Header
} from '@components/composite';
import { Text } from '@components/base';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { scale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { useTranslation } from 'react-i18next';

export const RecoveryPhraseModal = forwardRef<BottomSheetRef, BottomSheetProps>(
  (props, ref) => {
    const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
    const { t } = useTranslation();

    return (
      <BottomSheet
        swiperIconVisible
        ref={localRef}
        height={verticalScale(204)}
        borderRadius={verticalScale(32)}
        {...props}
      >
        <Header
          title={
            <Text
              fontFamily="Inter_700Bold"
              fontSize={20}
              color={COLORS.neutral800}
            >
              {t('create.wallet.recovery.phrase.modal.header')}
            </Text>
          }
          backIconVisible={false}
          style={{
            shadowColor: COLORS.transparent,
            backgroundColor: COLORS.transparent
          }}
        />
        <Text
          align="center"
          fontFamily="Inter_500Medium"
          fontSize={16}
          style={{ paddingHorizontal: scale(16) }}
        >
          {t('create.wallet.recovery.phrase.modal.text')}
        </Text>
      </BottomSheet>
    );
  }
);
