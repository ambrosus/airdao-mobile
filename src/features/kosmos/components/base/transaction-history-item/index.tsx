import React, { useMemo } from 'react';
import { Row, Spacer, Text } from '@components/base';
import { styles } from './styles';
import { TokenLogo } from '@components/modular';
import { Token, TxType } from '@features/kosmos/types';
import {
  formatDecimals,
  timestampToFormatedDate
} from '@features/kosmos/utils';
import { COLORS } from '@constants/colors';
import { BigNumber, ethers } from 'ethers';
import { useKosmosMarketsContextSelector } from '@features/kosmos/context';

type NotRequiredToken = Token | undefined;

interface TransactionHistoryItemProps {
  transaction: TxType;
  quoteToken: NotRequiredToken;
  payoutToken: NotRequiredToken;
}

const LEFT_COLUMN_WIDTH = '35%';
const RIGHT_COLUMNS_WIDTH = '55.215%';

export const TransactionHistoryItem = ({
  transaction,
  quoteToken,
  payoutToken
}: TransactionHistoryItemProps) => {
  const { tokens } = useKosmosMarketsContextSelector();
  const date = useMemo(
    () => timestampToFormatedDate(new Date(transaction.date).getTime()),
    [transaction.date]
  );

  const payout = useMemo(
    () =>
      formatDecimals(
        ethers.utils.formatUnits(
          BigNumber.from(transaction?.payoutAmount),
          payoutToken?.decimals
        ),
        payoutToken?.contractAddress,
        tokens
      ),
    [payoutToken, tokens, transaction?.payoutAmount]
  );

  const amount = useMemo(
    () =>
      formatDecimals(
        ethers.utils.formatUnits(
          BigNumber.from(transaction?.bondAmount),
          quoteToken?.decimals
        ),
        quoteToken?.contractAddress,
        tokens
      ),
    [quoteToken, tokens, transaction?.bondAmount]
  );

  return (
    <Row alignItems="center" justifyContent="space-around" style={styles.row}>
      <Row width={LEFT_COLUMN_WIDTH} alignItems="center">
        <TokenLogo scale={0.6} token={quoteToken?.symbol ?? ''} />
        <Spacer horizontal value={10} />
        <Text
          fontSize={16}
          fontFamily="Inter_600SemiBold"
          color={COLORS.neutral600}
          numberOfLines={1}
        >
          {amount}
        </Text>
      </Row>
      <Row
        width={RIGHT_COLUMNS_WIDTH}
        alignItems="center"
        justifyContent="space-between"
      >
        <Text
          fontSize={14}
          fontFamily="Inter_500Medium"
          color={COLORS.neutral600}
          numberOfLines={1}
        >
          {payout} {payoutToken?.symbol}
        </Text>
        <Text
          fontSize={12}
          fontFamily="Inter_500Medium"
          color={COLORS.neutral600}
          numberOfLines={1}
        >
          {date}
        </Text>
      </Row>
    </Row>
  );
};
