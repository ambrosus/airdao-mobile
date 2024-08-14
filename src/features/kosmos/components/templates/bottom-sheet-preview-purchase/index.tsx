import React, {
  ReactNode,
  forwardRef,
  useCallback,
  useMemo,
  useState
} from 'react';
import { View } from 'react-native';
import { ethers } from 'ethers';
import { upperCase } from 'lodash';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { Row, Text } from '@components/base';
import { useForwardedRef } from '@hooks';
import { COLORS } from '@constants/colors';
import { MarketType } from '@features/kosmos/types';
import { useMarketDetails } from '@features/kosmos/lib/hooks';
import { TokenLogo } from '@components/modular';
import { useKosmosMarketsContextSelector } from '@features/kosmos/context';
import {
  _timestampToDate,
  formatDecimals,
  timestampToFormatedDate
} from '@features/kosmos/utils';
import { BuyBondButton } from '../../modular';
import { StakePending } from '@screens/StakingPool/components';

interface BottomSheetPreviewPurchaseProps {
  market: MarketType;
}

export const BottomSheetPreviewPurchase = forwardRef<
  BottomSheetRef,
  BottomSheetPreviewPurchaseProps
>(({ market }, ref) => {
  const { t } = useTranslation();
  const bottomSheetRef = useForwardedRef(ref);
  const { amountToBuy } = useKosmosMarketsContextSelector();
  const { payoutToken, quoteToken, willGetSubFee, protocolFee } =
    useMarketDetails(market);
  const { tokens } = useKosmosMarketsContextSelector();

  const [isTransactionProcessing, setIsTransactionProcessing] = useState(false);

  const formattedWillGetSubFee = useMemo(() => {
    if (!willGetSubFee) return '';
    return +ethers.utils.formatUnits(willGetSubFee, quoteToken?.decimals);
  }, [quoteToken?.decimals, willGetSubFee]);

  const calculatedProtocolFee = useMemo(() => {
    return (+amountToBuy * protocolFee) / 100;
  }, [amountToBuy, protocolFee]);

  const onDismissBottomSheet = useCallback(
    () => bottomSheetRef.current?.dismiss(),
    [bottomSheetRef]
  );

  const willGetAfterUnlock = useMemo(
    () =>
      formatDecimals(
        formattedWillGetSubFee,
        payoutToken?.contractAddress,
        tokens
      ),
    [formattedWillGetSubFee, payoutToken?.contractAddress, tokens]
  );

  return (
    <BottomSheet
      swiperIconVisible={!isTransactionProcessing}
      closeOnBackPress={!isTransactionProcessing}
      swipingEnabled={!isTransactionProcessing}
      ref={bottomSheetRef}
    >
      <View style={styles.container}>
        {isTransactionProcessing ? (
          <StakePending />
        ) : (
          <View style={styles.innerContainer}>
            <Text
              fontSize={20}
              fontFamily="Inter_600SemiBold"
              color={COLORS.neutral800}
              style={styles.heading}
            >
              Preview
            </Text>

            <Row alignItems="center" justifyContent="space-between">
              <StyledTextItem>{t('kosmos.buying')}</StyledTextItem>
              <Row style={styles.bondsRowGap} alignItems="center">
                <TokenLogo scale={0.5} token={quoteToken?.symbol ?? ''} />
                <StyledTextItem isValue>
                  {amountToBuy} {quoteToken?.symbol}
                </StyledTextItem>
              </Row>
            </Row>
            <Row alignItems="center" justifyContent="space-between">
              <StyledTextItem>{t('kosmos.getting')}</StyledTextItem>
              <StyledTextItem isValue>
                {amountToBuy
                  ? formatDecimals(
                      formattedWillGetSubFee,
                      payoutToken?.contractAddress,
                      tokens
                    )
                  : '-'}{' '}
                {payoutToken?.symbol.toUpperCase()}
              </StyledTextItem>
            </Row>
            <Row alignItems="center" justifyContent="space-between">
              <StyledTextItem>
                {t('kosmos.table.headings.discount')}
              </StyledTextItem>
              <StyledTextItem isValue>
                {market.discount.toFixed(2)}%
              </StyledTextItem>
            </Row>
            {market?.vestingType === 'Fixed-expiry' ? (
              <Row alignItems="center" justifyContent="space-between">
                <StyledTextItem>Vesting expired date</StyledTextItem>
                <StyledTextItem isValue>
                  {_timestampToDate(+market.vesting)}
                </StyledTextItem>
              </Row>
            ) : (
              <Row alignItems="center" justifyContent="space-between">
                <StyledTextItem>{t('kosmos.lock.period')}</StyledTextItem>
                <StyledTextItem isValue>
                  {timestampToFormatedDate(market.start)}
                  {' - '}
                  {timestampToFormatedDate(market.conclusion)}
                </StyledTextItem>
              </Row>
            )}
            <Row alignItems="center" justifyContent="space-between">
              <StyledTextItem>{t('kosmos.protocol.fee')}</StyledTextItem>
              <StyledTextItem isValue>
                {calculatedProtocolFee.toFixed()}{' '}
                {upperCase(quoteToken?.symbol)}
              </StyledTextItem>
            </Row>
            <BuyBondButton
              willGetAfterUnlock={willGetAfterUnlock}
              onDismissBottomSheet={onDismissBottomSheet}
              setIsTransactionProcessing={setIsTransactionProcessing}
              market={market}
            />
          </View>
        )}
      </View>
    </BottomSheet>
  );
});

const StyledTextItem = ({
  children,
  isValue = false
}: {
  children: ReactNode;
  isValue?: boolean;
}) => {
  const color = isValue ? COLORS.neutral800 : COLORS.neutral400;

  return (
    <Text fontSize={16} fontFamily="Inter_500Medium" color={color}>
      {children}
    </Text>
  );
};
