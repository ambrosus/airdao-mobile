import React, { Dispatch, SetStateAction, useCallback, useMemo } from 'react';
import { ethers } from 'ethers';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import { useWallet } from '@hooks';
import { PrimaryButton, Toast, ToastType } from '@components/modular';
import { useKosmosMarketsContextSelector } from '@features/kosmos/context';
import { MarketType } from '@features/kosmos/types';
import {
  useBondContracts,
  useMarketDetails,
  useTransactionErrorHandler
} from '@features/kosmos/lib/hooks';
import { purchaseBonds } from '@features/kosmos/lib/contracts';
import Config from '@constants/config';
import { sendFirebaseEvent } from '@lib/firebaseEventAnalytics/sendFirebaseEvent';
import { CustomAppEvents } from '@lib/firebaseEventAnalytics/constants/CustomAppEvents';
import { buttonWithShadowStyle } from '@constants/shadow';
import { TextOrSpinner } from '@components/composite';

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

  const { _extractPrivateKey } = useWallet();
  const { contracts } = useBondContracts();
  const { error } = useTransactionErrorHandler(market);
  const { quoteToken, willGetSubFee, payoutToken } = useMarketDetails(market);
  const { amountToBuy } = useKosmosMarketsContextSelector();

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
            setIsTransactionProcessing(false);

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
    t,
    amountToBuy,
    contracts,
    createNewSigner,
    market,
    onDismissBottomSheet,
    payoutToken,
    quoteToken,
    setIsTransactionProcessing,
    willGetAfterUnlock,
    willGetSubFee
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
        label={t('kosmos.button.buy.bond')}
        loadingLabel={t('kosmos.button.processing')}
        loading={isTransactionProcessing}
      />
    </PrimaryButton>
  );
};
