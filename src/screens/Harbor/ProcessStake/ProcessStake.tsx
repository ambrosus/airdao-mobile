import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
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
import { useBalanceOfAddress, useKeyboardHeight } from '@hooks';
import { InputWithoutTokenSelect } from '@components/templates';
import { ExplorerAccount, Token } from '@models';
import { AMB_DECIMALS } from '@constants/variables';
import { CryptoCurrencyCode } from '@appTypes';
import { TokenUtils } from '@utils/token';
import { PrimaryButton } from '@components/modular';
import { useHarborStore } from '@entities/harbor/model/harbor-store';
import { NumberUtils } from '@utils/number';
import { DEFAULT_STAKE_PREVIEW } from '@entities/harbor/constants';
import { BottomSheetHarborPreView } from '@features/harbor/components/harbor-preview';

export const ProcessStake = () => {
  const [previewData, setPreviewData] = useState(DEFAULT_STAKE_PREVIEW);

  const { t } = useTranslation();
  const bottomSheetRef = useRef<BottomSheetRef>(null);
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
    return !amountToStake || !!inputError;
  }, [amountToStake, inputError]);

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

  const keyboardHeight = useKeyboardHeight();

  const initialMargin = useSharedValue(0);
  const margin = useAnimatedStyle(() => {
    return {
      marginBottom: withTiming(initialMargin.value)
    };
  });

  useEffect(() => {
    initialMargin.value = withTiming(keyboardHeight, {
      duration: 0
    });
  }, [initialMargin, keyboardHeight]);

  return (
    <SafeAreaView>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            onRefresh={refetchAll}
            refreshing={isLoading}
            removeClippedSubviews
          />
        }
        contentContainerStyle={styles.container}
        style={styles.main}
      >
        <View>
          <Header title={<HarborTitle harborAPR={harborAPR} />} />
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
        </View>
        <Animated.View style={[margin]}>
          <PrimaryButton disabled={buttonDisabled} onPress={onReviewStake}>
            <Text
              fontFamily="Inter_700Bold"
              fontSize={scale(16)}
              color={buttonDisabled ? COLORS.neutral500 : COLORS.neutral0}
            >
              {t('button.confirm')}
            </Text>
          </PrimaryButton>
        </Animated.View>
        <BottomSheetHarborPreView
          modalType="stake"
          previewData={previewData}
          ref={bottomSheetRef}
        />
      </ScrollView>
    </SafeAreaView>
  );
};
