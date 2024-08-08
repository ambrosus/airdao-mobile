import React, { ReactNode } from 'react';
import { LayoutChangeEvent, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import { Status } from '@components/templates/Bridge/BridgeTransaction/components/Status/Status';
import { RowJustifyAlignedItem } from '@features/kosmos/components/base';
import { Row, Text } from '@components/base';
import { useMarketDetails } from '@features/kosmos/lib/hooks';
import { MarketType } from '@features/kosmos/types';
import { TokenLogo } from '@components/modular';
import { COLORS } from '@constants/colors';
import { timestampToFormatedDate } from '@features/kosmos/utils';

interface MarketTableDetailsProps {
  market: MarketType;
  onHandlerMarketLayout: (event: LayoutChangeEvent) => void;
}

export const MarketTableDetails = ({
  market,
  onHandlerMarketLayout
}: MarketTableDetailsProps) => {
  const { t } = useTranslation();

  const { payoutToken, assetValue, lockPeriod, availableAmount } =
    useMarketDetails(market);

  return (
    <View onLayout={onHandlerMarketLayout} style={styles.container}>
      {/* Assets in Bond */}
      <RowJustifyAlignedItem label={t('kosmos.assets.bond')}>
        <Row alignItems="center" style={styles.bondAssetsRow}>
          <TokenLogo scale={0.6} token={payoutToken?.symbol ?? ''} />
          <StyledTextItem>{payoutToken?.symbol}</StyledTextItem>
        </Row>
      </RowJustifyAlignedItem>
      {/* Asset value */}
      <RowJustifyAlignedItem label={t('kosmos.assets.value')}>
        <Row alignItems="center">
          <StyledTextItem>${market.isLive ? assetValue : 0}</StyledTextItem>
        </Row>
      </RowJustifyAlignedItem>
      {/* Lock Period */}
      <RowJustifyAlignedItem label={t('kosmos.lock.period')}>
        <Row alignItems="center">
          <StyledTextItem>{lockPeriod}</StyledTextItem>
        </Row>
      </RowJustifyAlignedItem>
      {/* Available amount */}
      <RowJustifyAlignedItem label={t('kosmos.available.amount')}>
        <Row alignItems="center">
          <StyledTextItem>
            {availableAmount} {payoutToken?.symbol}
          </StyledTextItem>
        </Row>
      </RowJustifyAlignedItem>
      <RowJustifyAlignedItem label={t('kosmos.market.duration')}>
        <Row alignItems="center">
          <StyledTextItem>
            {timestampToFormatedDate(market.start)}
            {' - '}
            {timestampToFormatedDate(market.conclusion)}
          </StyledTextItem>
        </Row>
      </RowJustifyAlignedItem>
      {/* Status */}
      <RowJustifyAlignedItem label={t('common.status')}>
        <Row alignItems="center">
          <Status status={market.isLive ? 'active' : 'closed'} />
        </Row>
      </RowJustifyAlignedItem>
    </View>
  );
};

const StyledTextItem = ({ children }: { children: ReactNode }) => {
  return (
    <Text
      fontSize={14}
      fontFamily="Inter_600SemiBold"
      color={COLORS.neutral800}
    >
      {children}
    </Text>
  );
};
