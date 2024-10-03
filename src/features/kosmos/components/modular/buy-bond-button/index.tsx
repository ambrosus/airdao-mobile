import React, { Dispatch, SetStateAction, useCallback, useMemo } from 'react';
import { ethers } from 'ethers';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import { useWallet } from '@hooks';
import { Text } from '@components/base';
import { PrimaryButton, Toast, ToastType } from '@components/modular';
import { COLORS } from '@constants/colors';
import { useKosmosMarketsContextSelector } from '@features/kosmos/context';
import { MarketType } from '@features/kosmos/types';
import {
  useBondContracts,
  useMarketDetails,
  useTransactionErrorHandler
} from '@features/kosmos/lib/hooks';
import { purchaseBonds } from '@features/kosmos/lib/contracts';
import Config from '@constants/config';
import { HomeNavigationProp } from '@appTypes';

interface BuyBondButtonProps {
  market: MarketType;
  setIsTransactionProcessing: Dispatch<SetStateAction<boolean>>;
  onDismissBottomSheet: () => void;
  willGetAfterUnlock: string | number;
}

export const BuyBondButton = ({
  market,
  setIsTransactionProcessing,
  onDismissBottomSheet,
  willGetAfterUnlock
}: BuyBondButtonProps) => {
  const { t } = useTranslation();
  const navigation: HomeNavigationProp = useNavigation();

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
        .then((tx: any) => {
          if (tx) {
            onDismissBottomSheet();
            setTimeout(() => {
              setIsTransactionProcessing(false);
              navigation.goBack();
            }, 500);

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
    navigation,
    onDismissBottomSheet,
    payoutToken,
    quoteToken,
    setIsTransactionProcessing,
    willGetAfterUnlock,
    willGetSubFee
  ]);

  const disabled = useMemo(
    () => !parseFloat(amountToBuy) || error !== '',
    [amountToBuy, error]
  );

  const textColor = useMemo(() => {
    return disabled ? COLORS.alphaBlack30 : COLORS.neutral0;
  }, [disabled]);

  return (
    <PrimaryButton
      disabled={disabled}
      style={styles.button}
      onPress={onBuyBondsPress}
    >
      <Text fontSize={16} fontFamily="Inter_500Medium" color={textColor}>
        {t('kosmos.button.buy.bond')}
      </Text>
    </PrimaryButton>
  );
};
