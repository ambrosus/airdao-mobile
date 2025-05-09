import { useMemo, useRef } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button, Row, Text } from '@components/base';
import { BottomSheetRef } from '@components/composite';
import { TokenLogo } from '@components/modular';
import { COLORS } from '@constants/colors';
import { DECIMAL_LIMIT } from '@constants/variables';
import { useBridgeTransactionStatus } from '@features/bridge/hooks/useBridgeTransactionStatus';
import { BottomSheetBridgeTransactionHistory } from '@features/bridge/templates/BottomSheetBridgeTransactionHistory/BottomSheetBridgeTransactionHistory';
import { BottomSheetBridgeTransactionPendingHistory } from '@features/bridge/templates/BottomSheetBridgeTransactionPendingHistory';
import { BridgeTransactionHistoryDTO } from '@models/dtos/Bridge';
import {
  NumberUtils,
  scale,
  NETWORK,
  tokenThumb,
  transactionFrom
} from '@utils';
import { styles } from './BridgeTransaction.style';

interface BridgeTransactionModel {
  transaction: BridgeTransactionHistoryDTO;
}

export const BridgeTransaction = ({ transaction }: BridgeTransactionModel) => {
  const { t } = useTranslation();
  const bottomSheetRef = useRef<BottomSheetRef | null>(null);
  const bottomSheetPendingRef = useRef<BottomSheetRef | null>(null);

  const { confirmations, minSafetyBlocks, stage } = useBridgeTransactionStatus(
    transaction.withdrawTx,
    transaction.transferFinishTxHash === ''
  );

  const formattedAmount = NumberUtils.limitDecimalCount(
    transaction.decimalAmount,
    DECIMAL_LIMIT.CRYPTO
  );
  const transactionStatus = useMemo(() => {
    if (!transaction.transferFinishTxHash && +stage !== 2.2) {
      return 'pending';
    }

    if (!transaction.transferFinishTxHash && +stage === 2.2) {
      return 'confirmations';
    }

    return 'success';
  }, [stage, transaction]);

  const onPreviewTransactionDetails = () => {
    if (transactionStatus === 'success') {
      bottomSheetRef.current?.show();
    } else {
      bottomSheetPendingRef.current?.show();
    }
  };

  const statusStyle = useMemo(() => {
    const isSuccessTransaction = transactionStatus === 'success';
    return {
      ...styles.statusPoint,
      backgroundColor: isSuccessTransaction ? COLORS.green500 : COLORS.yellow500
    };
  }, [transactionStatus]);

  return (
    <>
      <Button onPress={onPreviewTransactionDetails}>
        <View style={styles.container}>
          <View style={styles.innerContainer}>
            <Row style={styles.leftContentRow} alignItems="flex-start">
              <TokenLogo
                scale={scale(0.6)}
                token={tokenThumb(transaction.tokenFrom.name)}
              />
              <Text
                fontSize={14}
                fontFamily="Inter_500Medium"
                color="#1D1D1D"
              >{`${formattedAmount} ${transactionFrom(
                transaction.tokenFrom.name
              )}`}</Text>
            </Row>
            <Text
              fontSize={12}
              fontFamily="Inter_500Medium"
              color={COLORS.alphaBlack50}
              numberOfLines={1}
            >
              {t('bridge.transaction.destination', {
                networkTo:
                  NETWORK[transaction.networkTo as keyof typeof NETWORK]
              })}
            </Text>
          </View>
          <View style={{ ...statusStyle }} />
        </View>
      </Button>

      <BottomSheetBridgeTransactionHistory
        ref={bottomSheetRef}
        confirmations={confirmations}
        transaction={transaction}
      />

      <BottomSheetBridgeTransactionPendingHistory
        ref={bottomSheetPendingRef}
        transaction={transaction}
        liveTransactionInformation={{
          stage,
          confirmations: {
            current: confirmations,
            minSafetyBlocks
          }
        }}
      />
    </>
  );
};
