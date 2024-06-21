import React, { forwardRef, RefObject, useMemo } from 'react';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils/scaling';
import { DECIMAL_LIMIT, DEVICE_HEIGHT } from '@constants/variables';
import { useTranslation } from 'react-i18next';
import { PrimaryButton } from '@components/modular';
import { FlatList, View } from 'react-native';
import { BigNumber } from 'ethers';
import { CryptoCurrencyCode } from '@appTypes';
import { useBridgeContextSelector } from '@contexts/Bridge';
import { useBridgeNetworksData } from '@hooks/bridge/useBridgeNetworksData';
import { formatUnits } from 'ethers/lib/utils';
import { NumberUtils } from '@utils/number';

interface CryptoAmount {
  amount: BigNumber;
  decimals: number;
}

interface DataToPreviewModel {
  name: string;
  crypto: CryptoAmount;
  usdAmount: string | null;
  symbol?: CryptoCurrencyCode | string;
}

interface BottomSheetChoseNetworksProps {
  ref: RefObject<BottomSheetRef>;
  onAcceptPress: () => void;
  dataToPreview: DataToPreviewModel[];
  btnTitle: string;
}

export const BottomSheetBridgePreview = forwardRef<
  BottomSheetRef,
  BottomSheetChoseNetworksProps
>((props, ref) => {
  const { t } = useTranslation();
  const { onAcceptPress, dataToPreview, btnTitle } = props;
  const { networksParams, tokenParams } = useBridgeContextSelector();
  const {
    methods: { validateBalance }
  } = useBridgeNetworksData({});

  const isWithdrawAmountIsGraterThanBalance = useMemo(() => {
    const feeToken = networksParams?.find(
      (token) => token?.renderTokenItem.isNativeCoin
    );
    const feeTokenSymbol = feeToken?.renderTokenItem?.symbol ?? 'amb';
    const selectedToken = tokenParams.value.renderTokenItem;
    if (selectedToken.symbol === feeTokenSymbol) {
      let withdrawSum = BigNumber.from(0);
      dataToPreview
        .filter((item) => item.symbol === selectedToken.symbol)
        .forEach((item) => (withdrawSum = withdrawSum.add(item.crypto.amount)));
      return !validateBalance({
        balance: selectedToken.balance,
        amount: withdrawSum,
        token: feeToken,
        error: ''
      });
    } else {
      return false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [networksParams, dataToPreview]);

  const buttonTitle = isWithdrawAmountIsGraterThanBalance
    ? t('common.try.again')
    : btnTitle;

  const onButtonPress = () => {
    if (isWithdrawAmountIsGraterThanBalance) {
      // @ts-ignore
      ref?.current?.dismiss();
    } else {
      onAcceptPress();
    }
  };

  const renderItem = (item: DataToPreviewModel) => {
    const amountToRender = NumberUtils.limitDecimalCount(
      formatUnits(item.crypto.amount, item.crypto.decimals),
      DECIMAL_LIMIT.CRYPTO
    );

    return (
      <>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}
        >
          <Text>{item.name}</Text>
          <Text>
            <Text>{`${amountToRender}  ${item.symbol}`}</Text>{' '}
            {!!item.usdAmount && <Text>{`$${item.usdAmount}`}</Text>}
          </Text>
        </View>
        <Spacer value={scale(16)} />
      </>
    );
  };
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
        <FlatList
          data={dataToPreview}
          // @ts-ignore
          renderItem={(item) => renderItem(item.item)}
        />
        <Spacer value={verticalScale(15)} />
        <PrimaryButton onPress={onButtonPress}>
          <Text
            fontFamily="Inter_600SemiBold"
            color={COLORS.neutral0}
            fontSize={16}
          >
            {buttonTitle}
          </Text>
        </PrimaryButton>
        <Spacer value={10} />
        {isWithdrawAmountIsGraterThanBalance && (
          <Text style={{ color: COLORS.error400, textAlign: 'center' }}>
            {t('bridge.insufficient.funds')}
          </Text>
        )}
      </View>
    </BottomSheet>
  );
});
