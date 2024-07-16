import React, { ReactNode } from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import { Status } from '@components/templates/Bridge/BridgeTransaction/components/Status/Status';
import { RowJustifyAlignedItem } from '@features/kosmos/components/base';
import { Row, Text } from '@components/base';
import { useMarketDetails } from '@features/kosmos/lib/hooks';
import { MarketType } from '@features/kosmos/types';
import { TokenLogo } from '@components/modular';
import { COLORS } from '@constants/colors';
import { timestampToFormatedDate } from '@features/kosmos/utils';

enum TableKeys {
  AssetsInBond = 'ASSETS IN BOND',
  AssetValue = 'ASSET VALUE',
  LockPeriod = 'LOCK PERIOD',
  AvailableAmount = 'AVAILABLE AMOUNT',
  MarketDuration = 'MARKET DURATION',
  Status = 'STATUS'
}

interface MarketTableDetailsProps {
  market: MarketType;
}

export const MarketTableDetails = ({ market }: MarketTableDetailsProps) => {
  const { payoutToken, assetValue, lockPeriod, availableAmount } =
    useMarketDetails(market);

  return (
    <View style={styles.container}>
      {/* Assets in Bond */}
      <RowJustifyAlignedItem label={TableKeys.AssetsInBond}>
        <Row alignItems="center" style={styles.bondAssetsRow}>
          <TokenLogo scale={0.6} token={payoutToken?.symbol ?? ''} />
          <StyledTextItem>{payoutToken?.symbol}</StyledTextItem>
        </Row>
      </RowJustifyAlignedItem>
      {/* Asset value */}
      <RowJustifyAlignedItem label={TableKeys.AssetValue}>
        <Row alignItems="center">
          <StyledTextItem>${market.isLive ? assetValue : 0}</StyledTextItem>
        </Row>
      </RowJustifyAlignedItem>
      {/* Lock Period */}
      <RowJustifyAlignedItem label={TableKeys.LockPeriod}>
        <Row alignItems="center">
          <StyledTextItem>{lockPeriod}</StyledTextItem>
        </Row>
      </RowJustifyAlignedItem>
      {/* Available amount */}
      <RowJustifyAlignedItem label={TableKeys.AvailableAmount}>
        <Row alignItems="center">
          <StyledTextItem>
            {availableAmount} {payoutToken?.symbol}
          </StyledTextItem>
        </Row>
      </RowJustifyAlignedItem>
      <RowJustifyAlignedItem label={TableKeys.LockPeriod}>
        <Row alignItems="center">
          <StyledTextItem>
            {timestampToFormatedDate(market.start)}
            {' - '}
            {timestampToFormatedDate(market.conclusion)}
          </StyledTextItem>
        </Row>
      </RowJustifyAlignedItem>
      {/* Status */}
      <RowJustifyAlignedItem label={TableKeys.Status}>
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
