import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Row, Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { _txStatusLabel, _txStatusThumbnail } from '@features/explorer/utils';
import { Transaction, TransactionTokenInfo } from '@models';
import { NumberUtils, StringUtils, scale, verticalScale } from '@utils';
import { styles } from './styles';

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

    return transaction.isSent && transactionTokenInfo.cryptoAmount !== '0'
      ? `-${amount}`
      : amount;
  }, [transaction, transactionTokenInfo.cryptoAmount]);

  const isTransferAndSentTx = useMemo(() => {
    const type = _txStatusLabel(transaction);
    const types = ['Transaction', 'Transfer'];

    return types.includes(type) && transaction.isSent;
  }, [transaction]);

  const label = useMemo(
    () =>
      t(`common.transaction.${isTransferAndSentTx ? 'destination' : 'from'}`),
    [isTransferAndSentTx, t]
  );

  const address = useMemo(
    () =>
      StringUtils.formatAddress(
        transaction[isTransferAndSentTx ? 'to' : 'from'],
        5,
        5
      ),
    [isTransferAndSentTx, transaction]
  );

  return (
    <View style={styles.container}>
      <Row alignItems="center" justifyContent="space-between">
        <Row alignItems="center">
          {_txStatusThumbnail(transaction)}
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
              {label} {address}
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
