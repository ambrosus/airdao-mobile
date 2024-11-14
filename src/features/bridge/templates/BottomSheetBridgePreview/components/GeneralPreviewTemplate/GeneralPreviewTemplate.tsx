import { PreviewDataTemplate } from '@features/bridge/templates/BottomSheetBridgePreview/components';
import React, { useEffect } from 'react';
import { BridgeTransactionPendingTemplate } from '@features/bridge/templates/BottomSheetBridgeTransactionPendingHistory/components';
import { useBridgeTransactionStatus } from '@features/bridge/hooks/useBridgeTransactionStatus';
import { useBridgeContextData } from '@features/bridge/context';
import { BridgeTransactionHistoryDTO } from '@models/dtos/Bridge';
import { Row, Spacer, Spinner, Text } from '@components/base';
import { TouchableOpacity, View } from 'react-native';
import { COLORS } from '@constants/colors';
import { useTranslation } from 'react-i18next';
import { NumberUtils } from '@utils/number';
import { scale } from '@utils/scaling';
import { CloseCircleIcon } from '@components/svg/icons/v2';
import { PrimaryButton } from '@components/modular';

interface GeneralPreviewDataModel {
  errorBalance: boolean;
  onAcceptPress: () => Promise<void>;
  onClose: () => void;
}

export const GeneralPreviewTemplate = ({
  errorBalance,
  onAcceptPress,
  onClose
}: GeneralPreviewDataModel) => {
  const { t } = useTranslation();

  const { methods, variables } = useBridgeContextData();
  const { setProcessingTransaction } = methods;
  const {
    processingTransaction,
    amountToBridge,
    selectedTokenFrom,
    destinationData
  } = variables;

  const header = t('bridge.transaction.preview.header')
    .replace(
      '{{amount}}',
      NumberUtils.limitDecimalCount(amountToBridge || '', 2)
    )
    .replace('{{symbol}}', selectedTokenFrom.symbol || '')
    .replace('{{network}}', destinationData.value.name);

  useEffect(() => {
    if (!processingTransaction?.withdrawTx && processingTransaction) {
      const getTransaction = async (
        _transaction: BridgeTransactionHistoryDTO
      ) => _transaction.wait();
      try {
        getTransaction(processingTransaction).then((transaction) => {
          setProcessingTransaction({
            ...processingTransaction,
            eventId: 0,
            userTo: transaction.to,
            withdrawTx: transaction.transactionHash
          });
          return transaction;
        });
      } catch (e) {
        // ignore
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processingTransaction]);

  const { confirmations, minSafetyBlocks, stage } = useBridgeTransactionStatus(
    processingTransaction?.withdrawTx || '',
    processingTransaction?.transferFinishTxHash === ''
  );

  const isPendingTransaction = stage !== '4';

  if (!processingTransaction) {
    return (
      <PreviewDataTemplate
        errorBalance={errorBalance}
        onAcceptPress={onAcceptPress}
      />
    );
  }

  return (
    <View>
      <Row justifyContent={'space-between'}>
        <Text
          numberOfLines={2}
          fontSize={scale(20)}
          fontFamily="Inter_700Bold"
          color={COLORS.neutral800}
        >
          {header}
        </Text>
        {isPendingTransaction ? (
          <Spinner customSize={15} />
        ) : (
          <TouchableOpacity onPress={onClose}>
            <CloseCircleIcon />
          </TouchableOpacity>
        )}
      </Row>
      <Spacer value={10} />
      <BridgeTransactionPendingTemplate
        onClose={onClose}
        transaction={processingTransaction}
        liveTransactionInformation={{
          stage,
          confirmations: {
            current: confirmations,
            minSafetyBlocks
          }
        }}
      />
      <PrimaryButton onPress={onClose}>
        <Text fontFamily="Inter_600SemiBold" color={COLORS.neutral0}>
          {t('common.done')}
        </Text>
      </PrimaryButton>
      <Spacer value={scale(30)} />
    </View>
  );
};