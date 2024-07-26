import React, { Dispatch, SetStateAction, useCallback, useMemo } from 'react';
import { ethers } from 'ethers';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles';
import { Text } from '@components/base';
import { PrimaryButton, Toast, ToastType } from '@components/modular';
import { COLORS } from '@constants/colors';
import { useKosmosMarketsContextSelector } from '@features/kosmos/context';
import { MarketType } from '@features/kosmos/types';
import {
  useMarketDetails,
  useTransactionErrorHandler,
  useBondContracts
} from '@features/kosmos/lib/hooks';
import { purchaseBonds } from '@features/kosmos/lib/contracts';
import { useBridgeContextData } from '@contexts/Bridge';
import { Cache, CacheKey } from '@lib/cache';
import Config from '@constants/config';

import { HomeNavigationProp } from '@appTypes';

interface BuyBondButtonProps {
  market: MarketType;
  setIsTransactionProcessing: Dispatch<SetStateAction<boolean>>;
  onDismissBottomSheet: () => void;
}

export const BuyBondButton = ({
  market,
  setIsTransactionProcessing,
  onDismissBottomSheet
}: BuyBondButtonProps) => {
  const navigation: HomeNavigationProp = useNavigation();

  const { selectedAccount } = useBridgeContextData();
  const { contracts } = useBondContracts();
  const { error } = useTransactionErrorHandler(market);
  const { quoteToken, willGetSubFee } = useMarketDetails(market);
  const { amountToBuy } = useKosmosMarketsContextSelector();

  const createNewSigner = useCallback(async () => {
    const privateKey = (await Cache.getItem(
      // @ts-ignore
      `${CacheKey.WalletPrivateKey}-${selectedAccount._raw?.hash}`
    )) as string;

    const provider = new ethers.providers.JsonRpcProvider(Config.NETWORK_URL);
    return new ethers.Wallet(privateKey, provider);
  }, [selectedAccount]);

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
            setIsTransactionProcessing(false);
          }
        });
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      onDismissBottomSheet();

      setTimeout(() => {
        setIsTransactionProcessing(false);
        navigation.goBack();
      }, 500);

      setTimeout(() => {
        Toast.show({
          text: `Success! You bought ${amountToBuy} ${quoteToken?.symbol} bond`,
          type: ToastType.Success
        });
      }, 600);
    }
  }, [
    amountToBuy,
    contracts,
    createNewSigner,
    market.id,
    market.marketType,
    market.vestingType,
    navigation,
    onDismissBottomSheet,
    quoteToken?.contractAddress,
    quoteToken?.decimals,
    quoteToken?.symbol,
    setIsTransactionProcessing,
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
        Buy bond
      </Text>
    </PrimaryButton>
  );
};
