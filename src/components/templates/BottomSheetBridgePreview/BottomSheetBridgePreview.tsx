import React, { forwardRef, RefObject, useMemo } from 'react';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils/scaling';
import { useTranslation } from 'react-i18next';
import { PrimaryButton } from '@components/modular';
import { FlatList, View } from 'react-native';
import { BigNumber } from 'ethers';
import { CryptoCurrencyCode } from '@appTypes';
import { useBridgeContextData } from '@contexts/Bridge';
import { useBridgeNetworksData } from '@hooks/bridge/useBridgeNetworksData';
import { formatUnits } from 'ethers/lib/utils';
import { NumberUtils } from '@utils/number';
import { BridgeNetworksSelected } from '@components/templates/Bridge/BridgeNetworksSelected/BridgeNetworksSelected';
import { DECIMAL_LIMIT } from '@constants/variables';

interface CryptoAmount {
  amount: BigNumber;
  decimals: number;
  cutToPrecision?: number;
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
  const { networksParams, tokenParams, fromParams, toParams } =
    useBridgeContextData();
  const {
    methods: { isAmountGraterThenBalance }
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
      return isAmountGraterThenBalance({
        balance: selectedToken.balance,
        amount: withdrawSum,
        token: feeToken
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
      item.crypto.cutToPrecision ?? DECIMAL_LIMIT.CRYPTO
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
    <BottomSheet ref={ref} swiperIconVisible={true}>
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
        <BridgeNetworksSelected
          networkFrom={fromParams.value.id}
          networkTo={toParams.value.id}
        />
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
      <Spacer value={verticalScale(34)} />
    </BottomSheet>
  );
});
