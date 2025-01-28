import React, { useCallback, useMemo, useRef, useState } from 'react';
import { RefreshControl, View } from 'react-native';
import { ethers } from 'ethers';
import { formatEther, parseEther } from 'ethers/lib/utils';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CryptoCurrencyCode } from '@appTypes';
import { Spacer, Text } from '@components/base';
import { BottomSheetRef, Header } from '@components/composite';
import { AutoScrollBox, PrimaryButton } from '@components/modular';
import { InputWithoutTokenSelect } from '@components/templates';
import { COLORS } from '@constants/colors';
import { AMB_DECIMALS } from '@constants/variables';
import { StakedBalanceInfo } from '@entities/harbor/components/composite';
import { DEFAULT_STAKE_PREVIEW } from '@entities/harbor/constants';
import { useHarborStore } from '@entities/harbor/model/harbor-store';
import { useWalletStore } from '@entities/wallet';
import { BottomSheetHarborPreView } from '@features/harbor/components/harbor-preview';
import { useBalanceOfAddress } from '@hooks';
import { ExplorerAccount, Token } from '@models';
import { scale, NumberUtils, TokenUtils } from '@utils';
import { HarborTitle, RateInfo } from './components';
import { styles } from './styles';

export const ProcessStake = () => {
  const { top } = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheetRef>(null);
  const { t } = useTranslation();

  const [previewData, setPreviewData] = useState(DEFAULT_STAKE_PREVIEW);

  const [amountToStake, setAmountToStake] = useState('');
  const [inputError, setInputError] = useState('');

  const { data: harborData, updateAll, loading } = useHarborStore();
  const { wallet } = useWalletStore();

  const { apr: harborAPR, stakeLimit, userStaked } = harborData;

  const {
    data: selectedAccountBalance,
    refetch: refetchAmbBalance,
    loading: accountDataLoading
  } = useBalanceOfAddress(wallet?.address || '');

  const refetchAll = async () => {
    try {
      if (wallet?.address) {
        updateAll(wallet.address);
      }
      if (refetchAmbBalance) {
        refetchAmbBalance();
      }
    } catch (error) {
      throw error;
    }
  };

  const account = wallet ? ExplorerAccount.fromDBModel(wallet) : null;

  const ambTokenData: Token = useMemo(
    () =>
      new Token(
        {
          name: 'AirDAO',
          address: account?.address || '',
          isNativeCoin: true,
          balance: {
            wei: selectedAccountBalance?.wei || '0',
            ether: selectedAccountBalance?.ether || 0,
            formattedBalance: ethers.utils.formatUnits(
              selectedAccountBalance?.wei || '0',
              AMB_DECIMALS
            )
          },
          symbol: CryptoCurrencyCode.AMB,
          decimals: AMB_DECIMALS,
          tokenNameFromDatabase: 'AirDAO'
        },
        TokenUtils
      ),
    [account, selectedAccountBalance]
  );

  const isLoading = useMemo(() => {
    return loading || accountDataLoading;
  }, [loading, accountDataLoading]);

  const buttonDisabled = useMemo(() => {
    return !amountToStake || !!inputError || isLoading;
  }, [amountToStake, inputError, isLoading]);

  const onChangeText = (value: string) => {
    if (value) {
      const greaterThenBalance = parseEther(value).gt(
        selectedAccountBalance.wei
      );
      if (greaterThenBalance) {
        setInputError(t('bridge.insufficient.funds'));
      } else {
        setInputError('');
      }
    }
    setAmountToStake(value);
  };

  const onReviewStake = useCallback(() => {
    if (parseEther(amountToStake).lt(stakeLimit)) {
      setInputError(
        `Min ${NumberUtils.formatNumber(+formatEther(stakeLimit))} ${
          CryptoCurrencyCode.AMB
        }`
      );
      return;
    }
    const data = {
      amount: amountToStake,
      token: CryptoCurrencyCode.AMB,
      receiveAmount: amountToStake,
      receiveToken: CryptoCurrencyCode.stAMB,
      fromAddress: wallet?.address || '',
      apy: harborAPR
    };
    setPreviewData(data);
    bottomSheetRef.current?.show();
  }, [amountToStake, harborAPR, stakeLimit, wallet?.address]);

  return (
    <View style={{ paddingTop: top }}>
      <AutoScrollBox
        header={<Header title={<HarborTitle harborAPR={harborAPR} />} />}
        maxPointToScroll={55}
        refreshControl={
          <RefreshControl
            onRefresh={refetchAll}
            refreshing={isLoading}
            removeClippedSubviews
          />
        }
      >
        <View style={styles.main}>
          <Spacer value={scale(8)} />
          <StakedBalanceInfo
            stakedValue={NumberUtils.numberToTransformedLocale(
              NumberUtils.limitDecimalCount(+formatEther(userStaked), 2)
            )}
            coin="AMB"
            title={t('harbor.staked.balance')}
          />
          <Spacer value={scale(8)} />
          <InputWithoutTokenSelect
            inputError={inputError}
            value={amountToStake}
            exchange={{
              token: CryptoCurrencyCode.stAMB,
              value: amountToStake
            }}
            token={ambTokenData}
            onChangeText={onChangeText}
            onPressMaxAmount={() => {
              onChangeText(formatEther(ambTokenData.balance.wei));
            }}
          />
          <Text
            fontSize={scale(12)}
            style={styles.stakeInfoText}
            color={COLORS.neutral600}
          >
            {t('harbor.staked.info')}
          </Text>
          <RateInfo
            availableToStake={formatEther(selectedAccountBalance.wei)}
          />
          <Spacer value={scale(16)} />
          <PrimaryButton disabled={buttonDisabled} onPress={onReviewStake}>
            <Text
              fontFamily="Inter_500Medium"
              fontSize={scale(14)}
              color={buttonDisabled ? COLORS.neutral500 : COLORS.neutral0}
            >
              {t('button.confirm')}
            </Text>
          </PrimaryButton>
          <BottomSheetHarborPreView
            amountSetter={setAmountToStake}
            modalType="stake"
            previewData={previewData}
            ref={bottomSheetRef}
          />
        </View>
      </AutoScrollBox>
    </View>
  );
};
