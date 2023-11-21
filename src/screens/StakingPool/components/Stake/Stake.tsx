import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Spacer, Text } from '@components/base';
import { PrimaryButton } from '@components/modular';
import { scale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { BottomSheetRef, InputWithIcon } from '@components/composite';

export const StakeToken = () => {
  const { t } = useTranslation();
  const [stakeAmount, setStakeAmount] = useState('');
  const previewDisabled = !stakeAmount || stakeAmount === '0';
  const previewModalRef = useRef<BottomSheetRef>(null);

  const showPreview = () => {
    previewModalRef.current?.show();
  };

  // const hidePreview = () => {
  //   previewModalRef.current?.dismiss();
  // };

  return (
    <View style={styles.container}>
      <Text
        fontSize={16}
        fontFamily="Inter_500Medium"
        fontWeight="500"
        color={COLORS.neutral900}
      >
        {t('staking.pool.stake.amount')}
      </Text>
      <Spacer value={verticalScale(8)} />
      <InputWithIcon
        iconRight={
          <View style={styles.currencyBadge}>
            <Text
              color={COLORS.gray800}
              fontSize={14}
              fontFamily="Inter_500Medium"
              fontWeight="500"
            >
              AMB
            </Text>
          </View>
        }
        type="number"
        value={stakeAmount}
        onChangeValue={setStakeAmount}
        placeholder="0"
        maxLength={12}
      />
      <Spacer value={verticalScale(44)} />
      <PrimaryButton onPress={showPreview} disabled={previewDisabled}>
        <Text color={previewDisabled ? COLORS.alphaBlack30 : COLORS.neutral0}>
          {t(previewDisabled ? 'button.enter.amount' : 'button.preview')}
        </Text>
      </PrimaryButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(16)
  },
  currencyBadge: {
    paddingHorizontal: scale(8),
    borderWidth: 1,
    borderColor: COLORS.alphaBlack10,
    borderRadius: 1000
  }
});
