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
  transactionTokenInfo: TransactionTokenInfo;
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
  const isERC1155 = transactionTokenInfo.type === 'ERC-1155';
  const isContractCall = transaction.type.includes('ContractCall');
  const isTokenTransfer = transaction.type === 'TokenTransfer';
  const isSuccessTransaction = transaction.status === 'SUCCESS';

  const amountTokenLogo = useMemo(() => {
    switch (true) {
      case isERC1155:
      case isTransfer:
        return 'AirDAO';
      case isTokenTransfer:
        return transaction?.token?.name;
      case isContractCall:
        return transaction?.value?.symbol;
      default:
        return 'unknown';
    }
  }, [
    isContractCall,
    isERC1155,
    isTokenTransfer,
    isTransfer,
    transaction?.token?.name,
    transaction?.value?.symbol
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
    const fieldName = isSuccessTransaction ? 'success' : 'error';

    return {
      pointBackgroundColor: COLORS[`${fieldName}600`],
      backgroundColor: COLORS[`${fieldName}100`],
      textColor: COLORS[`${fieldName}500`]
    };
  }, [isSuccessTransaction]);

  const onRedirectToExplorerTransaction = useCallback(() => {
    Linking.openURL(`${Config.EXPLORER_URL}/tx/${transaction.hash}/`);
  }, [transaction.hash]);

  // TODO temporarily hide share buttons
  // const showShareTransaction = () => {
  //   shareTransactionModal.current?.show();
  // };

  return (
    <View testID="Transaction_Details">
      <Row alignItems="center">
        <TokenLogo token={amountTokenLogo} />
        <Spacer horizontal value={8} />
        <Text
          fontSize={22}
          fontFamily="Inter_700Bold"
          color={COLORS.neutral800}
        >
          {NumberUtils.numberToTransformedLocale(
            transactionTokenInfo.cryptoAmount
          )}{' '}
          {transaction.symbol}
        </Text>
      </Row>

      <View style={styles.detailsContainer}>
        <AddressRowWithAction
          label={t('common.transaction.from')}
          address={transaction.from}
        />
        <AddressRowWithAction
          label={t('common.transaction.to')}
          address={transaction.to}
        />

        <JustifiedRow>
          <DetailsItemTypography>{t('common.status')}</DetailsItemTypography>
          <Row
            alignItems="center"
            style={{
              ...styles.status,
              backgroundColor: transactionStatusStyle.backgroundColor
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
