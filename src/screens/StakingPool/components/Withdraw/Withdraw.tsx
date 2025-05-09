import { useCallback, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { staking } from '@api/staking/staking-service';
import { ReturnedPoolDetails } from '@api/staking/types';
import { HomeParamsList } from '@appTypes';
import { InputRef, Row, Spacer, Text } from '@components/base';
import {
  BottomSheet,
  BottomSheetRef,
  InputWithIcon,
  TextOrSpinner
} from '@components/composite';
import { PercentageBox } from '@components/composite/PercentageBox';
import { PrimaryButton } from '@components/modular';
import { COLORS } from '@constants/colors';
import { bnZERO } from '@constants/variables';
import { AccountDBModel } from '@database';
import {
  CustomAppEvents,
  sendFirebaseEvent
} from '@lib/firebaseEventAnalytics';
import { StakePending } from '@screens/StakingPool/components';
import { NumberUtils, StringUtils, verticalScale } from '@utils';
import { WithdrawTokenPreview } from './BottomSheet/Withdraw.Preview';
import { styles } from './styles';

const WITHDRAW_PERCENTAGES = [25, 50, 75, 100];

type ScrollType = 'focus' | 'blur';

interface WithdrawTokenProps {
  wallet: AccountDBModel | null;
  apy?: number;
  pool: ReturnedPoolDetails | undefined;
  isSwiping: boolean;
  onScroll?: (value: ScrollType) => void;
}

export const WithdrawToken = ({
  wallet,
  pool,
  isSwiping,
  onScroll
}: WithdrawTokenProps) => {
  const { t } = useTranslation();
  const navigation =
    useNavigation<NavigationProp<HomeParamsList, 'StakingPool'>>();

  const inputRef = useRef<InputRef>(null);
  const previewBottomSheetRef = useRef<BottomSheetRef>(null);

  const [loading, setLoading] = useState(false);
  const [isEstimatingGas, setIsEstimatingGas] = useState(false);
  const [estimatedGas, setEstimatedGas] = useState(bnZERO);
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');

  const _onScroll = (type: ScrollType) => {
    if (typeof onScroll === 'function') {
      onScroll(type);
    }
  };

  const onChangeWithdrawAmount = (value: string) => {
    setWithdrawAmount(StringUtils.removeNonNumericCharacters(value));
  };

  const onSelectMaxTokensAmount = useCallback(async () => {
    if (!pool) return;

    const maxWithdrawAmount =
      (parseFloat(String(pool?.user?.amb) || '0') * 100) / 100;

    setWithdrawAmount(maxWithdrawAmount.toString());
  }, [pool]);

  const onPercentSelect = useCallback(
    (percentage: number) => {
      if (percentage === 100) {
        onSelectMaxTokensAmount();
      }
      const calculatedToWithdraw = NumberUtils.limitDecimalCount(
        (parseFloat(String(pool?.user?.amb) || '0') * percentage) / 100,
        2
      );

      setWithdrawAmount(calculatedToWithdraw);
    },
    [onSelectMaxTokensAmount, pool?.user?.amb]
  );

  const onWithdrawPreview = useCallback(async () => {
    try {
      if (!!pool) {
        setIsEstimatingGas(true);
        const estimatedGas = await staking.unstake({
          pool,
          value: withdrawAmount,
          walletHash: (wallet?._raw as unknown as { hash: string }).hash,
          estimateGas: true
        });

        setEstimatedGas(estimatedGas);
      }

      setTimeout(() => {
        previewBottomSheetRef.current?.show();
      }, 500);
      inputRef.current?.blur();
    } catch (error) {
      throw error;
    } finally {
      setIsEstimatingGas(false);
    }
  }, [pool, wallet?._raw, withdrawAmount]);

  async function simulateNavigationDelay(navigate: () => void) {
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    previewBottomSheetRef.current?.dismiss();

    await delay(320);

    navigate();
    setLoading(false);
  }

  const onSubmitWithdrawTokens = useCallback(async () => {
    if (!pool) return;
    try {
      setLoading(true);
      // @ts-ignore
      const walletHash = wallet?._raw.hash;
      const result = await staking.unstake({
        pool,
        value: withdrawAmount,
        walletHash
      });

      if (!result) {
        await simulateNavigationDelay(() =>
          navigation.navigate('StakeErrorScreen')
        );
      } else {
        sendFirebaseEvent(CustomAppEvents.withdraw_finish);
        await simulateNavigationDelay(() =>
          navigation.navigate('StakeSuccessScreen', {
            type: 'withdraw',
            walletAddress: wallet?.address ?? ''
          })
        );
      }
    } finally {
      setWithdrawAmount('');
    }
  }, [withdrawAmount, pool, navigation, wallet]);

  const isWrongStakeValue = useMemo(() => {
    return (
      !withdrawAmount ||
      parseFloat(withdrawAmount) === 0 ||
      Number(withdrawAmount) > Number(pool?.user.amb)
    );
  }, [pool, withdrawAmount]);

  const renderCurrencyFieldIcon = useMemo(() => {
    return (
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
    );
  }, []);

  return (
    <View style={styles.container}>
      <Text
        fontSize={16}
        fontFamily="Inter_500Medium"
        fontWeight="500"
        color={COLORS.neutral900}
      >
        {t('common.transaction.amount')}
      </Text>
      <Spacer value={verticalScale(8)} />
      <InputWithIcon
        onFocus={() => _onScroll('focus')}
        onBlur={() => _onScroll('blur')}
        ref={inputRef}
        focusable={!isSwiping}
        editable={!isSwiping}
        iconRight={renderCurrencyFieldIcon}
        value={withdrawAmount}
        onChangeValue={onChangeWithdrawAmount}
        placeholder="0"
        maxLength={12}
        type="number"
      />
      <Spacer value={verticalScale(24)} />
      <Row alignItems="center" style={styles.row}>
        {WITHDRAW_PERCENTAGES.map((percentage) => (
          <PercentageBox
            key={percentage}
            onPress={onPercentSelect}
            percentage={percentage}
          />
        ))}
      </Row>
      <Spacer value={verticalScale(44)} />
      <PrimaryButton
        onPress={onWithdrawPreview}
        disabled={isWrongStakeValue || isEstimatingGas}
      >
        <TextOrSpinner
          loading={isEstimatingGas}
          spinnerColor={COLORS.brand500}
          label={t(isWrongStakeValue ? 'button.enter.amount' : 'common.review')}
          styles={{
            active: {
              color: isWrongStakeValue ? COLORS.alphaBlack30 : COLORS.neutral0
            }
          }}
        />
      </PrimaryButton>

      <BottomSheet
        ref={previewBottomSheetRef}
        swiperIconVisible={!loading}
        closeOnBackPress={!loading}
        swipingEnabled={!loading}
      >
        {loading ? (
          <StakePending />
        ) : (
          <WithdrawTokenPreview
            onSubmitWithdrawTokens={onSubmitWithdrawTokens}
            wallet={wallet?.address ?? ''}
            amount={parseFloat(withdrawAmount)}
            estimatedGas={estimatedGas}
          />
        )}
        <Spacer value={verticalScale(36)} />
      </BottomSheet>
    </View>
  );
};
