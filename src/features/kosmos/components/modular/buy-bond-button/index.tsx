import React, { Dispatch, SetStateAction, useCallback, useMemo } from 'react';
import { ethers } from 'ethers';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import { PrimaryButton, Toast, ToastType } from '@components/modular';
import {
  useBondContracts,
  useMarketDetails,
  useResetStore,
  useTransactionErrorHandler
} from '@features/kosmos/lib/hooks';
import { purchaseBonds } from '@features/kosmos/lib/contracts';
import Config from '@constants/config';

import {
  CustomAppEvents,
  sendFirebaseEvent
} from '@lib/firebaseEventAnalytics';
import { buttonWithShadowStyle } from '@constants/shadow';
import { TextOrSpinner } from '@components/composite';
import { usePurchaseStore } from '@features/kosmos';
import { useWalletPrivateKey } from '@entities/wallet';
import { MarketType } from '@entities/kosmos';

interface BuyBondButtonProps {
  market: MarketType;
  isTransactionProcessing: boolean;
  setIsTransactionProcessing: Dispatch<SetStateAction<boolean>>;
  onDismissBottomSheet: () => void;
  willGetAfterUnlock: string | number;
}

export const BuyBondButton = ({
  market,
  isTransactionProcessing,
  setIsTransactionProcessing,
  onDismissBottomSheet,
  willGetAfterUnlock
}: BuyBondButtonProps) => {
  const { t } = useTranslation();

  const { reset } = useResetStore();

  const { _extractPrivateKey } = useWalletPrivateKey();
  const { contracts } = useBondContracts();
  const { error } = useTransactionErrorHandler(market);
  const { quoteToken, willGetSubFee, payoutToken } = useMarketDetails(market);

  const { amountToBuy, onChangeAmountToBuy } = usePurchaseStore();

  const createNewSigner = useCallback(async () => {
    const privateKey = await _extractPrivateKey();

    const provider = new ethers.providers.JsonRpcProvider(Config.NETWORK_URL);
    return new ethers.Wallet(privateKey, provider);
  }, [_extractPrivateKey]);

  const onBuyBondsPress = useCallback(async () => {
    try {
      setIsTransactionProcessing(true);
      const signer = await createNewSigner();
      await (
        await purchaseBonds(
          contracts,
          {
            recipient: signer,
            referrer: signer,
            id: market.id,
            amount: ethers.utils
              .parseUnits(amountToBuy, quoteToken?.decimals)
              .toString(),
            minAmountOut:
              market.marketType === 'SDA' ? willGetSubFee ?? '0' : '0',
            vestingType: market.vestingType
          },
          quoteToken?.contractAddress ?? ''
        )
      )
        .wait()
        .then((tx: unknown) => {
          if (tx) {
            sendFirebaseEvent(CustomAppEvents.kosmos_market_buy);
            onDismissBottomSheet();
            reset();
            setIsTransactionProcessing(false);
            onChangeAmountToBuy('');
            setTimeout(() => {
              Toast.show({
                text: t('kosmos.buy.success.toast', {
                  amount: willGetAfterUnlock,
                  amountSymbol: payoutToken?.symbol
                }),
                type: ToastType.Success
              });
            }, 600);
          }
        });
    } catch (error) {
      Toast.show({
        text: `Error`,
        type: ToastType.Failed
      });
      throw error;
    } finally {
      setIsTransactionProcessing(false);
    }
  }, [
    setIsTransactionProcessing,
    createNewSigner,
    contracts,
    market.id,
    market.marketType,
    market.vestingType,
    amountToBuy,
    quoteToken?.decimals,
    quoteToken?.contractAddress,
    willGetSubFee,
    onDismissBottomSheet,
    reset,
    onChangeAmountToBuy,
    t,
    willGetAfterUnlock,
    payoutToken?.symbol
  ]);

  const disabled = useMemo(
    () => !parseFloat(amountToBuy) || error !== '' || isTransactionProcessing,
    [amountToBuy, error, isTransactionProcessing]
  );

  return (
    <PrimaryButton
      disabled={disabled}
      style={buttonWithShadowStyle(disabled, styles.button)}
      onPress={onBuyBondsPress}
    >
      <TextOrSpinner
        label={t('button.confirm')}
        loadingLabel={t('kosmos.button.processing')}
        loading={isTransactionProcessing}
      />
    </PrimaryButton>
  );
};
