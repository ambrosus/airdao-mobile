import React, {
  ReactNode,
  forwardRef,
  useCallback,
  useMemo,
  useState
} from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { Row, Spacer, Text } from '@components/base';
import { useForwardedRef } from '@hooks';
import { COLORS } from '@constants/colors';
import { Token, TxType } from '@features/kosmos/types';
import { TokenLogo } from '@components/modular';
import {
  MAINNET_VESTINGS,
  TESTNET_VESTINGS,
  formatDecimals
} from '@features/kosmos/utils';
import { useKosmosMarketsContextSelector } from '@features/kosmos/context';
import { Status } from '@components/templates/Bridge/BridgeTransaction/components/Status/Status';
import Config from '@constants/config';
import { StringUtils } from '@utils/string';
import { ClaimBondsButton } from '../../modular/claim-bonds-button';
import { StakePending } from '@screens/StakingPool/components';

const ADDRESS_LEFT_PADDING = 5;
const ADDRESS_RIGHT_PADDING = 4;

interface BottomSheetReviewOrderProps {
  transaction: TxType;
  payoutToken: Token | undefined;
  qouteToken: Token | undefined;
  amount: string;
  payout: string;
}

export const BottomSheetReviewOrder = forwardRef<
  BottomSheetRef,
  BottomSheetReviewOrderProps
>(({ transaction, payout, amount, payoutToken, qouteToken }, ref) => {
  const { t } = useTranslation();

  const bottomSheetRef = useForwardedRef(ref);
  const { tokens } = useKosmosMarketsContextSelector();
  const [isClaimingNow, setIsClaimingNow] = useState(false);

  const usdPayoutPrice = useMemo(() => {
    return +payout * (payoutToken?.price || 0);
  }, [payout, payoutToken?.price]);

  const vestingEndsDate = useMemo(() => {
    return transaction.vestingType === 'Fixed-expiry'
      ? +transaction.vesting
      : +transaction.vesting + transaction.date;
  }, [transaction.date, transaction.vesting, transaction.vestingType]);

  const isVestingPass = useMemo(() => {
    return vestingEndsDate * 1000 < new Date().getTime();
  }, [vestingEndsDate]);

  const status = useMemo(() => {
    const { isClaimed } = transaction;
    if (isClaimed) return 'claimed';
    if (!isVestingPass) return 'claim pending';

    return 'ready to claim';
  }, [isVestingPass, transaction]);

  const lockPeriod = useMemo(() => {
    if (!transaction.vesting) return null;

    const vestings =
      Config.env === 'testnet' ? TESTNET_VESTINGS : MAINNET_VESTINGS;

    return vestings.find((el) => el.value === +transaction.vesting)?.label;
  }, [transaction.vesting]);

  const onDismissBottomSheet = useCallback(() => {
    bottomSheetRef.current?.dismiss();
  }, [bottomSheetRef]);

  return (
    <BottomSheet
      swiperIconVisible={!isClaimingNow}
      closeOnBackPress={!isClaimingNow}
      swipingEnabled={!isClaimingNow}
      ref={bottomSheetRef}
    >
      <View style={styles.container}>
        {isClaimingNow ? (
          <StakePending />
        ) : (
          <>
            <Text
              fontSize={20}
              fontFamily="Inter_600SemiBold"
              color={COLORS.neutral800}
              style={styles.heading}
            >
              {t('kosmos.bottom.sheet.title')}
            </Text>

            <View style={styles.innerContainer}>
              <Row alignItems="center" justifyContent="space-between">
                <StyledTextItem>Bonds</StyledTextItem>
                <Row style={styles.bondsRowGap} alignItems="center">
                  <TokenLogo scale={0.5} token={qouteToken?.symbol ?? ''} />
                  <StyledTextItem isValue>{amount}</StyledTextItem>
                </Row>
              </Row>
              <Row alignItems="center" justifyContent="space-between">
                <StyledTextItem>
                  {t('kosmos.table.headings.discount')}
                </StyledTextItem>
                <StyledTextItem isValue>
                  {transaction.discount.toFixed(2)}%
                </StyledTextItem>
              </Row>
              <Row alignItems="center" justifyContent="space-between">
                <StyledTextItem>{t('kosmos.payout')}</StyledTextItem>
                <Row alignItems="center">
                  <StyledTextItem isValue>
                    {formatDecimals(
                      payout,
                      payoutToken?.contractAddress,
                      tokens
                    )}{' '}
                    {payoutToken?.symbol}
                  </StyledTextItem>
                  <Spacer horizontal value={4} />
                  <StyledTextItem>{usdPayoutPrice.toFixed(2)}$</StyledTextItem>
                </Row>
              </Row>
              <Row alignItems="center" justifyContent="space-between">
                <StyledTextItem>{t('common.status')}</StyledTextItem>
                <Status status={status} />
              </Row>
              <Row alignItems="center" justifyContent="space-between">
                <StyledTextItem>{t('kosmos.lock.period')}</StyledTextItem>
                <StyledTextItem isValue>{lockPeriod}</StyledTextItem>
              </Row>
              <Row alignItems="center" justifyContent="space-between">
                <StyledTextItem>{t('kosmos.transaction.hash')}</StyledTextItem>
                <StyledTextItem isValue primary>
                  {StringUtils.formatAddress(
                    transaction.txHash,
                    ADDRESS_LEFT_PADDING,
                    ADDRESS_RIGHT_PADDING
                  )}
                </StyledTextItem>
              </Row>
            </View>

            <ClaimBondsButton
              transaction={transaction}
              isClaimingNow={isClaimingNow}
              setIsClaimingNow={setIsClaimingNow}
              buttonStyle={styles.button}
              onDismissBottomSheet={onDismissBottomSheet}
              payout={payout}
            />
          </>
        )}
      </View>
    </BottomSheet>
  );
});

const StyledTextItem = ({
  children,
  isValue = false,
  primary = false
}: {
  children: ReactNode;
  isValue?: boolean;
  primary?: boolean;
}) => {
  const color = primary
    ? COLORS.brand500
    : isValue
    ? COLORS.neutral800
    : COLORS.neutral400;

  return (
    <Text fontSize={16} fontFamily="Inter_500Medium" color={color}>
      {children}
    </Text>
  );
};
