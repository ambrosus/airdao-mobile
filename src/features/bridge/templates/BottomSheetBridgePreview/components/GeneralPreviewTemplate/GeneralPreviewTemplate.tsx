import { useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Row, Spacer, Spinner, Text } from '@components/base';
import { BottomSheetSuccessView } from '@components/base/BottomSheetStatusView';
import { PrimaryButton } from '@components/modular';
import { CloseCircleIcon } from '@components/svg/icons/v2';
import { COLORS } from '@constants/colors';
import { useBridgeContextData } from '@features/bridge/context';
import { useBridgeTransactionStatus } from '@features/bridge/hooks/useBridgeTransactionStatus';
import { BridgeTransactionPendingTemplate } from '@features/bridge/templates/BottomSheetBridgeTransactionPendingHistory/components';
import { BridgeNetworksSelected } from '@features/bridge/templates/BridgeNetworksSelected/BridgeNetworksSelected';
import { NumberUtils, scale } from '@utils';
import { PreviewDataTemplate } from '../PreviewDataTemplate/PreviewDataTemplate';

interface GeneralPreviewDataModel {
  loader: boolean;
  errorBalance: boolean;
  onAcceptPress: () => void;
  onClose: () => void;
}

export const GeneralPreviewTemplate = ({
  loader,
  errorBalance,
  onAcceptPress,
  onClose
}: GeneralPreviewDataModel) => {
  const { t } = useTranslation();

  const { methods, variables } = useBridgeContextData();
  const { setProcessingTransaction, getTransactionTransaction } = methods;
  const {
    processingTransaction,
    amountToBridge,
    selectedTokenFrom,
    destinationData,
    fromData
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
      try {
        getTransactionTransaction(processingTransaction).then((transaction) => {
          // @ts-ignore
          const userTo = transaction?.to;
          // @ts-ignore
          const withdrawTx = transaction?.transactionHash;
          setProcessingTransaction({
            ...processingTransaction,
            eventId: 0,
            userTo,
            withdrawTx
          });
          return transaction;
        });
      } catch (e) {
        throw e;
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
        loader={loader}
        errorBalance={errorBalance}
        onAcceptPress={onAcceptPress}
      />
    );
  }

  const PendingTransactionContent = () => {
    return (
      <>
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
      </>
    );
  };

  const SuccessTransactionSent = () => (
    <>
      <BottomSheetSuccessView>
        <Spacer value={10} />
        <Text fontSize={17}>
          {t('bridge.transaction.success.description')
            .replace('${{amount}}', amountToBridge)
            .replace('${{symbol}}', selectedTokenFrom?.symbol || '')}
        </Text>
        <Spacer value={10} />
        <BridgeNetworksSelected
          networkFrom={fromData.value.id}
          networkTo={destinationData.value.id}
          size="small"
        />
      </BottomSheetSuccessView>
      <Spacer value={15} />
      <PrimaryButton onPress={onClose}>
        <Text fontFamily="Inter_600SemiBold" color={COLORS.neutral0}>
          {t('common.done')}
        </Text>
      </PrimaryButton>
      <Spacer value={scale(30)} />
    </>
  );

  return isPendingTransaction ? (
    <PendingTransactionContent />
  ) : (
    <SuccessTransactionSent />
  );
};
