import React, { useCallback, useState } from 'react';
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
import { useAccountByAddress } from '@hooks/database';
import { Cache, CacheKey } from '@lib/cache';
import { NumberUtils, StringUtils, getTokenSymbolFromDatabase } from '@utils';
import { styles } from './styles';
import { DetailsRowItem } from '../../base';

const ZERO = ethers.BigNumber.from(0);

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

  const isApprovalTx = transaction?.functionName === 'approve';
  const isAmbTransaction = request?.params[0]?.value;
  const isWithdraw = transaction?.functionName === 'withdraw';
  const isWrapOrUnwrap =
    transaction?.functionName === 'deposit' ||
    transaction?.functionName === 'withdraw';

  const { data: account } = useAccountByAddress(request?.params[0].from, true);

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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text
          fontSize={20}
          fontFamily="Inter_600SemiBold"
          color={COLORS.neutral800}
          align="center"
        >
          {t(
            isApprovalTx
              ? 'wallet.connect.approve.token'
              : 'wallet.connect.tx.request'
          )}
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
        />

        <DetailsRowItem
          field={isApprovalTx ? 'APPROVE' : 'INTERACTING'}
          value={
            isApprovalTx
              ? `${NumberUtils.numberToTransformedLocale(
                  ethers.utils.formatEther(
                    transaction?.decodedArgs?.amount ?? ZERO
                  )
                )} ${
                  isAmbTransaction
                    ? CryptoCurrencyCode.AMB
                    : getTokenSymbolFromDatabase(
                        request?.params[0]?.to.toUpperCase() ?? '',
                        true
                      )
                }`
              : StringUtils.formatAddress(
                  (isWrapOrUnwrap
                    ? request?.params[0]?.to
                    : transaction?.decodedArgs?.addresses?.[1]) ?? '',
                  5,
                  6
                )
          }
        />

        <DetailsRowItem
          field={isApprovalTx ? 'SPENDER' : 'AMOUNT'}
          value={
            isApprovalTx
              ? StringUtils.formatAddress(
                  transaction?.decodedArgs?.addresses?.[0] ?? '',
                  5,
                  6
                )
              : `${NumberUtils.numberToTransformedLocale(
                  ethers.utils.formatEther(
                    (isAmbTransaction
                      ? request.params[0].value
                      : transaction?.decodedArgs?.amount) ?? ZERO
                  )
                )} ${
                  isAmbTransaction
                    ? CryptoCurrencyCode.AMB
                    : isWithdraw
                    ? CryptoCurrencyCode.SAMB
                    : getTokenSymbolFromDatabase(
                        transaction?.decodedArgs?.addresses?.[0] ?? ''
                      )
                }`
          }
        />

        <DetailsRowItem
          field="FEE"
          value={`${NumberUtils.limitDecimalCount(
            ethers.utils.formatEther(request?.params[0].gas ?? ZERO),
            0
          )} ${CryptoCurrencyCode.AMB}`}
        />
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
