import React, { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Button, Row, Spacer, Text } from '@components/base';
import { PrimaryButton } from '@components/modular';
import { scale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import {
  BottomSheet,
  BottomSheetRef,
  InputWithIcon
} from '@components/composite';
import { useBalanceOfAddress, useUSDPrice } from '@hooks';
import { AccountDBModel } from '@database';
import { NumberUtils } from '@utils/number';
import { StringUtils } from '@utils/string';
import { StakePreview } from './Stake.Preview';
import { staking } from '@api/staking/staking-service';
import { ReturnedPoolDetails } from '@api/staking/types';
import { useAllAccounts } from '@hooks/database';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { HomeParamsList } from '@appTypes';
import { StakePending } from '@screens/StakingPool/components';
import { useStakingMultiplyContextSelector } from '@contexts';

const PercentageBox = ({
  percentage,
  onPress
}: {
  percentage: number;
  onPress: (percentage: number) => unknown;
}) => {
  const onPercentagePress = () => onPress(percentage);

  return (
    <Button onPress={onPercentagePress} style={styles.percentageBox}>
      <Text>{percentage}%</Text>
    </Button>
  );
};

interface StakeTokenProps {
  wallet: AccountDBModel | null;
  apy: number;
  pool: ReturnedPoolDetails | undefined;
}

export const StakeToken = ({ wallet, apy, pool }: StakeTokenProps) => {
  const navigation =
    useNavigation<NavigationProp<HomeParamsList, 'StakingPool'>>();
  const { t } = useTranslation();
  const [stakeAmount, setStakeAmount] = useState('');
  const previewDisabled = !stakeAmount || parseFloat(stakeAmount) === 0;
  const previewModalRef = useRef<BottomSheetRef>(null);
  const { data: ambBalance } = useBalanceOfAddress(wallet?.address || '');
  const stakeAmountUSD = useUSDPrice(parseFloat(stakeAmount || '0'));

  const { data: allWallets } = useAllAccounts();
  const [selectedWallet] = useState<AccountDBModel | null>(
    allWallets?.length > 0 ? allWallets[0] : null
  );

  const { fetchPoolDetails } = useStakingMultiplyContextSelector();

  const showPreview = () => {
    previewModalRef.current?.show();
  };

  const onPercentageBoxPress = useCallback(
    (percentage: number) => {
      setStakeAmount(
        NumberUtils.limitDecimalCount(
          (parseFloat(ambBalance?.ether || '0') * percentage) / 100,
          2
        )
      );
    },
    [ambBalance.ether]
  );

  const { data: accounts } = useAllAccounts();
  const selectedAccount = accounts.length > 0 ? accounts[0] : null;
  const [loading, setLoading] = useState(false);

  const processStake = useCallback(async () => {
    if (!pool) return;
    try {
      setLoading(true);
      // @ts-ignore
      const walletHash = selectedAccount?._raw.hash;
      const result = await staking.stake({
        pool,
        value: stakeAmount,
        walletHash
      });

      if (!result) {
        previewModalRef.current?.dismiss();
        navigation.navigate('StakeErrorScreen');
      } else {
        previewModalRef.current?.dismiss();
        navigation.navigate('StakeSuccessScreen', { type: 'stake' });
      }
    } finally {
      if (selectedWallet?.address) {
        await fetchPoolDetails(selectedWallet.address);
      }
      setStakeAmount('0');
      previewModalRef.current?.dismiss();
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool, stakeAmount, navigation, selectedAccount]);

  const onChangeStakeAmount = (value: string) => {
    setStakeAmount(StringUtils.removeNonNumericCharacters(value));
  };

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
        onChangeValue={onChangeStakeAmount}
        placeholder="0"
        maxLength={12}
      />
      <Spacer value={verticalScale(8)} />
      <Row alignItems="center" justifyContent="space-between">
        <Text
          fontSize={14}
          fontFamily="Inter_400Regular"
          fontWeight="400"
          color={COLORS.alphaBlack60}
        >
          ${NumberUtils.limitDecimalCount(stakeAmountUSD, 2)}
        </Text>
        <Text
          fontSize={14}
          fontFamily="Inter_400Regular"
          fontWeight="400"
          color={COLORS.alphaBlack60}
        >
          {t('common.balance')}:{' '}
          {NumberUtils.limitDecimalCount(ambBalance?.ether || 0, 2)} AMB
        </Text>
      </Row>
      <Spacer value={verticalScale(24)} />
      <Row
        alignItems="center"
        style={{ flexWrap: 'wrap', rowGap: verticalScale(16) }}
      >
        <PercentageBox onPress={onPercentageBoxPress} percentage={25} />
        <Spacer value={scale(16)} horizontal />
        <PercentageBox onPress={onPercentageBoxPress} percentage={50} />
        <Spacer value={scale(16)} horizontal />
        <PercentageBox onPress={onPercentageBoxPress} percentage={75} />
        <Spacer value={scale(16)} horizontal />
        <PercentageBox onPress={onPercentageBoxPress} percentage={100} />
      </Row>
      <Spacer value={verticalScale(24)} />
      <PrimaryButton onPress={showPreview} disabled={previewDisabled}>
        <Text color={previewDisabled ? COLORS.alphaBlack30 : COLORS.neutral0}>
          {t(previewDisabled ? 'button.enter.amount' : 'button.preview')}
        </Text>
      </PrimaryButton>
      <BottomSheet ref={previewModalRef} swiperIconVisible={true}>
        {loading ? (
          <StakePending />
        ) : (
          <StakePreview
            onPressStake={processStake}
            walletAddress={wallet?.address || ''}
            amount={parseFloat(stakeAmount || '0')}
            apy={apy}
          />
        )}
        <Spacer value={verticalScale(36)} />
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(24)
  },
  currencyBadge: {
    paddingHorizontal: scale(8),
    borderWidth: 1,
    borderColor: COLORS.alphaBlack10,
    borderRadius: 1000
  },
  percentageBox: {
    paddingVertical: verticalScale(6),
    paddingHorizontal: scale(12),
    backgroundColor: COLORS.alphaBlack5,
    borderRadius: 1000
  }
});
