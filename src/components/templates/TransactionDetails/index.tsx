import React, { useCallback, useMemo, useRef } from 'react';
import { Linking, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button, Row, Spacer, Text } from '@components/base';
import { BottomSheetRef } from '@components/composite';
import { Transaction, TransactionTokenInfo } from '@models/Transaction';
import { NumberUtils } from '@utils/number';
import { COLORS } from '@constants/colors';
import { SharePortfolio } from '../BottomSheetSharePortfolio';
import { styles } from './styles';
import { TokenLogo } from '@components/modular';
import { GlobeIcon } from '@components/svg/icons/v2';
import Config from '@constants/config';
import { DetailsItemTypography } from '@components/base/ExplorerTransactions';
import { AddressRowWithAction } from '../ExplorerAccount/components/address-row-with-action';

interface TransactionDetailsProps {
  transaction: Transaction;
  isShareable?: boolean;
  transactionTokenInfo?: TransactionTokenInfo;
}

const JustifiedRow = ({ children }: { children: React.ReactNode }) => (
  <Row alignItems="center" justifyContent="space-between">
    {children}
  </Row>
);

export const TransactionDetails = ({
  transaction,
  transactionTokenInfo
}: TransactionDetailsProps): JSX.Element => {
  const { t } = useTranslation();

  const shareTransactionModal = useRef<BottomSheetRef>(null);
  const currentStatus = t(`common.transaction.status.${transaction.status}`);

  const isTransfer = transaction.type === 'Transfer';
  const isERC1155 = transactionTokenInfo?.type === 'ERC-1155';
  const isContractCall = transaction.type.includes('ContractCall');
  const isTokenTransfer = transaction.type === 'TokenTransfer';
  const isBlockReward = transaction.type === 'BlockReward';
  const isSuccessTransaction = transaction.status === 'SUCCESS';
  const isPendingTransaction = transaction.status === 'PENDING';

  const amountTokenLogo = useMemo(() => {
    switch (true) {
      case isERC1155:
      case isTransfer:
        return 'AirDAO';
      case isTokenTransfer:
        return transaction?.token?.name;
      case isBlockReward:
      case isContractCall:
        return transaction?.value?.symbol;
      default: {
        if (transaction.value && transaction.value.symbol) {
          return transaction?.value?.symbol;
        }
        return 'unknown';
      }
    }
  }, [
    isBlockReward,
    isContractCall,
    isERC1155,
    isTokenTransfer,
    isTransfer,
    transaction?.token?.name,
    transaction.value
  ]);

  // Render Tx Status
  const transactionStatus = useMemo(() => {
    switch (transaction.status) {
      case 'FAIL':
      case 'SUCCESS':
        return currentStatus;
      default:
        return transaction.status;
    }
  }, [currentStatus, transaction.status]);

  const transactionStatusStyle = useMemo(() => {
    const fieldName = ['error', 'warning', 'success'][
      isSuccessTransaction ? 2 : isPendingTransaction ? 1 : 0
    ] as 'error' | 'warning' | 'success';

    return {
      backgroundColor: COLORS[`${fieldName}50`],
      textColor: COLORS[`${fieldName}700`],
      borderColor: COLORS[`${fieldName}100`]
    };
  }, [isSuccessTransaction, isPendingTransaction]);

  const onRedirectToExplorerTransaction = useCallback(() => {
    Linking.openURL(`${Config.EXPLORER_URL}/tx/${transaction.hash}/`);
  }, [transaction.hash]);

  const subheadingAmountColor = useMemo(() => {
    return transaction.isSent ? COLORS.neutral800 : '#23B083';
  }, [transaction]);

  const amountWithSymbolValue = useMemo(() => {
    const amount = NumberUtils.numberToTransformedLocale(transaction.amount);

    return transaction.isSent && transaction.amount !== 0
      ? `-${amount}`
      : amount;
  }, [transaction]);

  return (
    <View testID="Transaction_Details">
      <Row alignItems="center">
        <TokenLogo token={amountTokenLogo} />
        <Spacer horizontal value={8} />
        <Text
          fontSize={22}
          fontFamily="Inter_700Bold"
          color={subheadingAmountColor}
        >
          {amountWithSymbolValue} {transaction.symbol}
        </Text>
      </Row>

      <View style={styles.detailsContainer}>
        <AddressRowWithAction
          label={t('common.transaction.from')}
          address={transaction.from}
        />
        <AddressRowWithAction
          label={t('common.transaction.destination')}
          address={transaction.to}
        />

        <JustifiedRow>
          <DetailsItemTypography>{t('common.status')}</DetailsItemTypography>
          <Row
            alignItems="center"
            style={{
              ...styles.status,
              backgroundColor: transactionStatusStyle.backgroundColor,
              borderColor: transactionStatusStyle.borderColor
            }}
          >
            <Text
              fontSize={14}
              fontFamily="Inter_500Medium"
              color={transactionStatusStyle.textColor}
            >
              {transactionStatus}
            </Text>
          </Row>
        </JustifiedRow>
        <JustifiedRow>
          <DetailsItemTypography>
            {t('swap.bottom.sheet.lpfee')}
          </DetailsItemTypography>
          <DetailsItemTypography type="value">
            {NumberUtils.limitDecimalCount(transaction.fee.toString(), 2)} AMB
          </DetailsItemTypography>
        </JustifiedRow>

        <Button onPress={onRedirectToExplorerTransaction} style={styles.button}>
          <GlobeIcon />
          <Spacer horizontal value={8} />
          <Text
            fontSize={17}
            fontFamily="Inter_600SemiBold"
            color={COLORS.brand600}
          >
            {t('transaction.modal.buttons.explorer')}
          </Text>
        </Button>
      </View>

      <SharePortfolio
        ref={shareTransactionModal}
        balance={NumberUtils.limitDecimalCount(transaction.amount, 2)}
        currency="AMB"
        currencyPosition="right"
        txFee={transaction.fee}
        title={t('common.transaction')}
        bottomSheetTitle={t('common.share.transaction')}
        timestamp={transaction.timestamp}
      />
    </View>
  );
};
