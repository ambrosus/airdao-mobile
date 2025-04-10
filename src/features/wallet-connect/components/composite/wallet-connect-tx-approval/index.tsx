import { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import { JsonRpcResponse } from '@walletconnect/jsonrpc-types';
import { ethers } from 'ethers';
import { useTranslation } from 'react-i18next';
import { CryptoCurrencyCode } from '@appTypes';
import { Text } from '@components/base';
import { TextOrSpinner } from '@components/composite';
import { PrimaryButton, SecondaryButton } from '@components/modular';
import { COLORS } from '@constants/colors';
import {
  useHandleBottomSheetActions,
  useWalletConnectContextSelector
} from '@features/wallet-connect/lib/hooks';
import { CONNECT_VIEW_STEPS } from '@features/wallet-connect/types';
import {
  approveEIP155Request,
  httpsParser,
  rejectEIP155Request,
  walletKit
} from '@features/wallet-connect/utils';
import { useGetTokenDetails } from '@hooks';
import { useAccountByAddress } from '@hooks/database';
import { Cache, CacheKey } from '@lib/cache';
import { NumberUtils, StringUtils, getTokenSymbolFromDatabase } from '@utils';
import { styles } from './styles';
import { DetailsRowItem } from '../../base';

const ZERO = ethers.BigNumber.from(0);
const mappedFunctionNames = [
  'unknown',
  'unstake',
  'stake',
  'deposit',
  'withdraw'
];

export const WalletConnectTxApproval = () => {
  const { t } = useTranslation();
  const {
    request: data,
    transaction,
    setWalletConnectStep
  } = useWalletConnectContextSelector();

  const { onDismissWalletConnectBottomSheet } = useHandleBottomSheetActions();

  const [isLoadingReject, setIsLoadingReject] = useState(false);
  const [isLoadingApprove, setIsLoadingApprove] = useState(false);

  const requestEvent = data?.event;
  const topic = requestEvent?.topic;
  const params = requestEvent?.params;
  const request = params?.request;

  const isPersonalSign = transaction?.functionName === 'personal_sign';
  const isUnstake = transaction?.functionName === 'unstake';
  const isApprovalTx = transaction?.functionName === 'approve';
  const isAmbTransaction = request?.params[0]?.value;
  const isWithdraw = transaction?.functionName === 'withdraw';
  const isWrapOrUnwrap = mappedFunctionNames.includes(
    transaction?.functionName?.toLowerCase() ?? ''
  );

  const address = useMemo(() => {
    if (transaction?.decodedArgs && transaction.decodedArgs.from)
      return transaction?.decodedArgs.from?.toLowerCase();

    return request?.params[0].from.toLowerCase();
  }, [request?.params, transaction]);

  const { data: account } = useAccountByAddress(address, true);
  const { data: token, loading } = useGetTokenDetails(
    isApprovalTx
      ? request?.params[0]?.to
      : transaction?.decodedArgs?.addresses?.[0]
  );

  const onApprove = useCallback(async () => {
    if (requestEvent && topic) {
      setIsLoadingApprove(true);
      try {
        const privateKey = (await Cache.getItem(
          // @ts-ignore
          `${CacheKey.WalletPrivateKey}-${account?._raw.hash ?? ''}`
        )) as string;

        const response = await approveEIP155Request(
          requestEvent.id,
          requestEvent,
          privateKey
        );

        await walletKit.respondSessionRequest({
          topic,
          response: response as JsonRpcResponse
        });
      } catch (error) {
        onDismissWalletConnectBottomSheet();
        throw error;
      }

      setIsLoadingApprove(false);
      onDismissWalletConnectBottomSheet();
      setWalletConnectStep(CONNECT_VIEW_STEPS.INITIAL);
    }
  }, [
    account,
    onDismissWalletConnectBottomSheet,
    requestEvent,
    setWalletConnectStep,
    topic
  ]);

  const onReject = useCallback(async () => {
    if (request && topic) {
      setIsLoadingReject(true);

      const response = rejectEIP155Request(requestEvent);

      try {
        await walletKit.respondSessionRequest({
          topic,
          response: response as JsonRpcResponse
        });
      } catch (error) {
        onDismissWalletConnectBottomSheet();
        throw error;
      }
    }

    setIsLoadingReject(false);
    onDismissWalletConnectBottomSheet();
    setWalletConnectStep(CONNECT_VIEW_STEPS.INITIAL);
  }, [
    topic,
    request,
    requestEvent,
    setWalletConnectStep,
    onDismissWalletConnectBottomSheet
  ]);

  const tokenSymbol = useMemo(() => {
    if (isPersonalSign) return '';
    if (isAmbTransaction) return CryptoCurrencyCode.AMB;

    if (isUnstake) return CryptoCurrencyCode.stAMB;

    return getTokenSymbolFromDatabase(
      request?.params[0]?.to.toUpperCase() ?? '',
      true
    );
  }, [isAmbTransaction, isPersonalSign, isUnstake, request?.params]);

  const amountSymbol = useMemo(() => {
    if (isPersonalSign) return '';

    if (isAmbTransaction) return CryptoCurrencyCode.AMB;

    if (isWithdraw) return CryptoCurrencyCode.SAMB;

    if (isUnstake) return CryptoCurrencyCode.stAMB;

    return getTokenSymbolFromDatabase(
      transaction?.decodedArgs?.addresses?.[0] ?? ''
    );
  }, [
    isAmbTransaction,
    isPersonalSign,
    isUnstake,
    isWithdraw,
    transaction?.decodedArgs?.addresses
  ]);

  const title = useMemo(() => {
    if (isPersonalSign) return 'Signature request';
    if (isApprovalTx) return 'wallet.connect.approve.token';

    return 'wallet.connect.tx.request';
  }, [isApprovalTx, isPersonalSign]);

  const formatGasFee = useCallback(() => {
    const gas = request?.params[0].gas ?? ZERO;
    const gasInEth = ethers.utils.formatEther(gas);
    return `${NumberUtils.limitDecimalCount(gasInEth, 0)} ${
      CryptoCurrencyCode.AMB
    }`;
  }, [request?.params]);

  const formatAmount = useCallback(
    (amount: ethers.BigNumber, symbol: string) => {
      const amountInEth = ethers.utils.formatEther(amount ?? ZERO);
      return `${NumberUtils.numberToTransformedLocale(amountInEth)} ${symbol}`;
    },
    []
  );

  const getFieldLabel = useCallback(() => {
    switch (true) {
      case isPersonalSign:
        return 'SPENDER';
      case isApprovalTx:
        return 'APPROVE';
      default:
        return 'INTERACTING';
    }
  }, [isPersonalSign, isApprovalTx]);

  const getDisplayValue = useCallback(() => {
    if (isPersonalSign) {
      return StringUtils.formatAddress(
        transaction?.decodedArgs?.from ?? '',
        5,
        6
      );
    }

    if (isApprovalTx) {
      return formatAmount(
        transaction?.decodedArgs?.amount ?? ZERO,
        tokenSymbol === 'unknown' && !!token.symbol ? token.symbol : tokenSymbol
      );
    }

    const address = isWrapOrUnwrap
      ? request?.params[0]?.to
      : transaction?.decodedArgs?.addresses?.[1];
    return StringUtils.formatAddress(address ?? '', 5, 6);
  }, [
    isPersonalSign,
    isApprovalTx,
    isWrapOrUnwrap,
    request?.params,
    transaction?.decodedArgs?.addresses,
    transaction?.decodedArgs?.from,
    transaction?.decodedArgs?.amount,
    token,
    formatAmount,
    tokenSymbol
  ]);

  const getSecondaryValue = useCallback(() => {
    if (isApprovalTx) {
      return StringUtils.formatAddress(
        transaction?.decodedArgs?.addresses?.[0] ?? '',
        5,
        6
      );
    }

    const amount = isAmbTransaction
      ? request.params[0].value
      : transaction?.decodedArgs?.amount;
    return formatAmount(
      amount ?? ZERO,
      amountSymbol === 'unknown' && !!token.symbol ? token.symbol : amountSymbol
    );
  }, [
    isApprovalTx,
    isAmbTransaction,
    request?.params,
    transaction?.decodedArgs?.amount,
    transaction?.decodedArgs?.addresses,
    formatAmount,
    amountSymbol,
    token.symbol
  ]);

  if (loading) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text
          fontSize={20}
          fontFamily="Inter_600SemiBold"
          color={COLORS.neutral800}
          align="center"
        >
          {t(title)}
        </Text>

        {isApprovalTx && (
          <Text
            fontSize={15}
            fontFamily="Inter_500Medium"
            color={COLORS.neutral500}
            align="center"
            style={styles.approvalSubheading}
          >
            {t('wallet.connect.tx.approve.warning')}
          </Text>
        )}
      </View>

      <View style={styles.details}>
        <DetailsRowItem
          field="REQUEST"
          value={httpsParser(data?.event.verifyContext.verified.origin ?? '')}
          style={{ maxWidth: '60%' }}
        />

        <DetailsRowItem field={getFieldLabel()} value={getDisplayValue()} />

        {!isPersonalSign && (
          <DetailsRowItem
            field={isApprovalTx ? 'SPENDER' : 'AMOUNT'}
            value={getSecondaryValue()}
          />
        )}

        {!isPersonalSign && (
          <DetailsRowItem field="FEE" value={formatGasFee()} />
        )}
      </View>

      <PrimaryButton
        disabled={isLoadingApprove || isLoadingReject}
        onPress={onApprove}
      >
        <TextOrSpinner
          label={t(
            isApprovalTx ? 'wallet.connect.request.approve' : 'button.confirm'
          )}
          loading={isLoadingApprove}
          loadingLabel={undefined}
          spinnerColor={COLORS.brand600}
          styles={{ active: { color: COLORS.neutral0 } }}
        />
      </PrimaryButton>
      <SecondaryButton
        disabled={isLoadingApprove || isLoadingReject}
        style={styles.secondaryButton}
        onPress={onReject}
      >
        <TextOrSpinner
          label={t('button.cancel')}
          loading={isLoadingReject}
          loadingLabel={undefined}
          styles={{ active: { color: COLORS.brand600 } }}
        />
      </SecondaryButton>
    </View>
  );
};
