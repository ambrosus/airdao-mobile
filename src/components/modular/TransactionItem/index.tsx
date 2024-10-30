import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Transaction, TransactionTokenInfo } from '@models';
import { Row, Spacer, Text } from '@components/base';
import { scale, verticalScale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { StringUtils } from '@utils/string';
import { NumberUtils } from '@utils/number';
import { styles } from './styles';
import { _txStatusLabel, _txStatusThumbnail } from '@features/explorer/utils';

interface TransactionItemProps {
  transaction: Transaction;
  transactionTokenInfo: TransactionTokenInfo;
}

export const TransactionItem = ({
  transaction,
  transactionTokenInfo
}: TransactionItemProps): JSX.Element => {
  const { t } = useTranslation();

  const amountColor = useMemo(() => {
    return transaction.isSent ? COLORS.neutral800 : '#23B083';
  }, [transaction]);

  const amountWithSymbolValue = useMemo(() => {
    const amount = NumberUtils.numberToTransformedLocale(
      transactionTokenInfo.cryptoAmount
    );

    return transaction.isSent ? `-${amount}` : amount;
  }, [transaction, transactionTokenInfo.cryptoAmount]);

  return (
    <View style={styles.container}>
      <Row alignItems="center" justifyContent="space-between">
        <Row alignItems="center">
          <>{_txStatusThumbnail(transaction)}</>
          <Spacer value={scale(8)} horizontal />
          <View>
            <Text
              fontSize={16}
              fontFamily="Inter_500Medium"
              color={COLORS.neutral800}
            >
              {_txStatusLabel(transaction)}
            </Text>
            <Spacer value={verticalScale(4)} />
            <Text
              fontSize={13}
              fontFamily="Inter_600SemiBold"
              color={COLORS.neutral500}
            >
              {t('common.transaction.from')}{' '}
              {StringUtils.formatAddress(transaction.from, 5, 5)}
            </Text>
          </View>
        </Row>
        <View>
          <Text
            fontSize={16}
            align="right"
            fontFamily="Inter_400Regular"
            color={amountColor}
          >
            {amountWithSymbolValue} {transaction.symbol}
          </Text>
          <Spacer value={verticalScale(4)} />
        </View>
      </Row>
    </View>
  );
};
