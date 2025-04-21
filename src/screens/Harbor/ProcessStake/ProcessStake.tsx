import { useCallback, useMemo, useRef, useState } from 'react';
import { RefreshControl, View } from 'react-native';
import { ethers } from 'ethers';
import { formatEther, parseEther } from 'ethers/lib/utils';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CryptoCurrencyCode } from '@appTypes';
import { Spacer, Text } from '@components/base';
import { BottomSheetRef, Header, TextOrSpinner } from '@components/composite';
import { AutoScrollBox, PrimaryButton } from '@components/modular';
import { InputWithoutTokenSelect } from '@components/templates';
import { COLORS } from '@constants/colors';
import { AMB_DECIMALS } from '@constants/variables';
import { StakedBalanceInfo } from '@entities/harbor/components/composite';
import { DEFAULT_STAKE_PREVIEW } from '@entities/harbor/constants';
import { useHarborStore } from '@entities/harbor/model/harbor-store';
import { useWalletStore } from '@entities/wallet';
import { BottomSheetHarborPreview } from '@features/harbor/components/templates';
import { processStake } from '@features/harbor/lib/processHelpers/processStake';
import { useBalanceOfAddress } from '@hooks';
import { ExplorerAccount, Token } from '@models';
import {
  scale,
  NumberUtils,
  TokenUtils,
  estimatedNetworkProviderFee
} from '@utils';
import { HarborTitle, RateInfo } from './components';
import { styles } from './styles';

export const ProcessStake = () => {
  const { top } = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheetRef>(null);
  const { t } = useTranslation();

  const [previewData, setPreviewData] = useState(DEFAULT_STAKE_PREVIEW);
  const [amountToStake, setAmountToStake] = useState('');
  const [inputError, setInputError] = useState('');
  const [isEstimatingGas, setIsEstimatingGas] = useState(false);

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
          symbol: CryptoCurrencyCode.ASC,
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
    return !amountToStake || !!inputError || isLoading || isEstimatingGas;
  }, [amountToStake, inputError, isLoading, isEstimatingGas]);

  const onChangeText = useCallback(
    (value: string) => {
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
    },
    [selectedAccountBalance.wei, t]
  );

  const onReviewStake = useCallback(async () => {
    try {
      setIsEstimatingGas(true);
      if (parseEther(amountToStake).lt(stakeLimit)) {
        setInputError(
          `Min ${NumberUtils.formatNumber(+formatEther(stakeLimit))} ${
            CryptoCurrencyCode.ASC
          }`
        );
        return;
      }

      const data = {
        amount: amountToStake,
        token: CryptoCurrencyCode.ASC,
        receiveAmount: amountToStake,
        receiveToken: CryptoCurrencyCode.stAMB,
        fromAddress: wallet?.address || '',
        apy: harborAPR,
        estimatedGas: '0'
      };

      const txEstimateGas = await processStake(
        wallet,
        'amount' in data ? data?.amount : '',
        { estimateGas: true }
      );

      if (txEstimateGas instanceof ethers.BigNumber) {
        const txGasFee = await estimatedNetworkProviderFee(txEstimateGas);

        data.estimatedGas = NumberUtils.limitDecimalCount(
          ethers.utils.formatEther(txGasFee),
          2
        );
      }

      setPreviewData(data);
      bottomSheetRef.current?.show();
    } catch (error) {
      throw error;
    } finally {
      setIsEstimatingGas(false);
    }
  }, [amountToStake, harborAPR, stakeLimit, wallet]);

  const onPressMaxAmount = useCallback(async () => {
    const parsedBalance = ethers.utils.formatEther(
      ambTokenData.balance.wei ?? '0'
    );
    const bnBalance = ethers.utils.parseEther(parsedBalance);

    const txEstimateGas = await processStake(wallet, parsedBalance, {
      estimateGas: true
    });

    if (txEstimateGas instanceof ethers.BigNumber) {
      const txGasFee = await estimatedNetworkProviderFee(txEstimateGas);

      const maxSpendableBalance = ethers.utils.formatUnits(
        bnBalance.sub(txGasFee),
        AMB_DECIMALS
      );

      onChangeText(maxSpendableBalance);
    }
  }, [ambTokenData.balance.wei, onChangeText, wallet]);

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
            onPressMaxAmount={onPressMaxAmount}
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
            <TextOrSpinner
              loading={isEstimatingGas}
              spinnerColor={COLORS.brand500}
              label={t('button.confirm')}
              styles={{
                active: {
                  fontSize: scale(14),
                  fontFamily: 'Inter_500Medium',
                  color: buttonDisabled ? COLORS.neutral500 : COLORS.neutral0
                }
              }}
            />
          </PrimaryButton>
          <BottomSheetHarborPreview
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
