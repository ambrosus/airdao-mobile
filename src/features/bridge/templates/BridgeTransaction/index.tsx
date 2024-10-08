import React, { useMemo, useRef } from 'react';
import { View } from 'react-native';
import { styles } from './BridgeTransaction.style';

import { TokenLogo } from '@components/modular';
import { scale } from '@utils/scaling';
import { NumberUtils } from '@utils/number';
import { Status } from './components/Status/Status';
import { BottomSheetRef } from '@components/composite';
import { BridgeTransactionHistoryDTO } from '@models/dtos/Bridge';
import { Button, Row, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { NETWORK, tokenThumb, transactionFrom } from '@utils/bridge';
import { useBridgeTransactionStatus } from '@features/bridge/hooks/useBridgeTransactionStatus';
import { useTranslation } from 'react-i18next';
import { DECIMAL_LIMIT } from '@constants/variables';
import { BottomSheetBridgeTransactionPendingHistory } from '@features/bridge/templates/BottomSheetBridgeTransactionPendingHistory';
import { BottomSheetBridgeTransactionHistory } from '@features/bridge/templates/BottomSheetBridgeTransactionHistory/BottomSheetBridgeTransactionHistory';

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
              {t('bridge.transaction.to', {
                networkTo:
                  NETWORK[transaction.networkTo as keyof typeof NETWORK]
              })}
            </Text>
          </View>
          <Status
            steps={{ start: confirmations, end: minSafetyBlocks }}
            status={transactionStatus}
          />
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
