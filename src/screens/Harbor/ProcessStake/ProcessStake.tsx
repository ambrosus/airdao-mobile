import React, { useCallback, useMemo, useRef, useState } from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { ethers } from 'ethers';
import { formatEther, parseEther } from 'ethers/lib/utils';
import { BottomSheetRef, Header } from '@components/composite';
import { Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { scale } from '@utils/scaling';
import { HarborTitle, RateInfo, StakedBalanceInfo } from './components';
import { styles } from './styles';
import { useWalletStore } from '@entities/wallet';
import { useBalanceOfAddress } from '@hooks';
import { InputWithoutTokenSelect } from '@components/templates';
import { ExplorerAccount, Token } from '@models';
import { AMB_DECIMALS } from '@constants/variables';
import { CryptoCurrencyCode } from '@appTypes';
import { TokenUtils } from '@utils/token';
import { PrimaryButton } from '@components/modular';
import { useHarborStore } from '@entities/harbor/model/harbor-store';
import { NumberUtils } from '@utils/number';
import { DEFAULT_STAKE_PREVIEW } from '@entities/harbor/constants';
import { BottomSheetHarborStakePreView } from '@features/harbor/components/modular';

export const ProcessStake = () => {
  const [previewData, setPreviewData] = useState(DEFAULT_STAKE_PREVIEW);

  const { t } = useTranslation();
  const bottomSheetRef = useRef<BottomSheetRef>(null);
  const [amountToStake, setAmountToStake] = useState('');
  const [error, setError] = useState('');

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
      // ignore
    }
  };

  const account = wallet ? ExplorerAccount.fromDBModel(wallet) : null;

  if (account) {
    account.ambBalance = Number(selectedAccountBalance.ether);
    account.ambBalanceWei = selectedAccountBalance.wei;
  }

  const ambTokenData: Token = useMemo(
    () =>
      new Token(
        {
          name: 'AirDAO',
          address: account?.address || '',
          isNativeCoin: true,
          balance: {
            wei: account?.ambBalanceWei || '0',
            ether: account?.ambBalance || 0,
            formattedBalance: ethers.utils.formatUnits(
              account?.ambBalanceWei || '0',
              AMB_DECIMALS
            )
          },
          symbol: CryptoCurrencyCode.AMB,
          decimals: AMB_DECIMALS,
          tokenNameFromDatabase: 'AirDAO'
        },
        TokenUtils
      ),
    [account?.address, account?.ambBalance, account?.ambBalanceWei]
  );

  const isLoading = useMemo(() => {
    return loading || accountDataLoading;
  }, [loading, accountDataLoading]);

  const buttonDisabled = useMemo(() => {
    return !amountToStake || !!error;
  }, [amountToStake, error]);

  const onChangeText = (value: string) => {
    if (value) {
      const greaterThenBalance = parseEther(value).gt(
        selectedAccountBalance.wei
      );
      if (greaterThenBalance) {
        setError(t('bridge.insufficient.funds'));
      } else {
        setError('');
      }
    }
    setAmountToStake(value);
  };

  const onReviewStake = useCallback(() => {
    if (parseEther(amountToStake).lt(stakeLimit)) {
      setError('Lower Then minimal Stake Value');
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
    <SafeAreaView>
      <Header title={<HarborTitle harborAPR={harborAPR} />} />
      <ScrollView
        refreshControl={
          <RefreshControl
            onRefresh={refetchAll}
            refreshing={isLoading}
            removeClippedSubviews
          />
        }
        style={styles.main}
      >
        <Spacer value={scale(8)} />
        <StakedBalanceInfo
          stakedValue={NumberUtils.limitDecimalCount(
            +formatEther(userStaked),
            2
          )}
          coin="AMB"
          title={t('harbor.staked.balance')}
        />
        <Spacer value={scale(8)} />

        <InputWithoutTokenSelect
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
        {error && (
          <Text
            style={{
              paddingVertical: scale(8)
            }}
            color={COLORS.warning600}
          >
            {error}
          </Text>
        )}
        <Text
          fontSize={14}
          style={styles.stakeInfoText}
          color={COLORS.neutral600}
        >
          {t('harbor.staked.info')}
        </Text>
        <RateInfo availableToStake={formatEther(selectedAccountBalance.wei)} />
        <Spacer value={scale(16)} />
        <PrimaryButton disabled={buttonDisabled} onPress={onReviewStake}>
          <Text
            fontFamily="Inter_700Bold"
            color={buttonDisabled ? COLORS.neutral500 : COLORS.neutral0}
          >
            {t('button.confirm')}
          </Text>
        </PrimaryButton>
        <BottomSheetHarborStakePreView
          previewData={previewData}
          ref={bottomSheetRef}
        />
      </ScrollView>
    </SafeAreaView>
  );
};
