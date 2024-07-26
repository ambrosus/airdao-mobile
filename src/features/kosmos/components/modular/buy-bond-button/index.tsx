import React, { useCallback, useMemo } from 'react';
import Animated, { AnimatedStyleProp } from 'react-native-reanimated';
import { styles } from './styles';
import { Text } from '@components/base';
import { PrimaryButton } from '@components/modular';
import { useKosmosMarketsContextSelector } from '@features/kosmos/context';
import { COLORS } from '@constants/colors';
import { MarketType } from '@features/kosmos/types';
import {
  useMarketDetails,
  useTransactionErrorHandler,
  useBondContracts
} from '@features/kosmos/lib/hooks';
import { purchaseBonds } from '@features/kosmos/lib/contracts';
import { useBridgeContextData } from '@contexts/Bridge';
import { Cache, CacheKey } from '@lib/cache';
import { ethers } from 'ethers';
import Config from '@constants/config';

type AnimatedStyleType = AnimatedStyleProp<{ marginTop: number }>;

interface BuyBondButtonProps {
  animatedStyle: AnimatedStyleType;
  market: MarketType;
}

export const BuyBondButton = ({
  animatedStyle,
  market
}: BuyBondButtonProps) => {
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
            minAmountOut: market.marketType === 'SDA' ? willGetSubFee : '0',
            vestingType: market.vestingType
          },
          quoteToken?.contractAddress ?? ''
        )
      )
        .wait()
        .then((res: any) => {
          console.warn(res);
        });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }, [
    amountToBuy,
    contracts,
    createNewSigner,
    market.id,
    market.marketType,
    market.vestingType,
    quoteToken?.contractAddress,
    quoteToken?.decimals,
    willGetSubFee
  ]);

  const disabled = useMemo(
    () => !parseFloat(amountToBuy) || error !== '',
    [amountToBuy, error]
  );

  const label = useMemo(
    () => (disabled ? 'Enter amount to buy' : 'Preview'),
    [disabled]
  );

  const textColor = useMemo(() => {
    return disabled ? COLORS.alphaBlack30 : COLORS.neutral0;
  }, [disabled]);

  return (
    <Animated.View style={[styles.footer, animatedStyle]}>
      <PrimaryButton
        disabled={disabled}
        style={styles.button}
        onPress={onBuyBondsPress}
      >
        <Text fontSize={16} fontFamily="Inter_500Medium" color={textColor}>
          {label}
        </Text>
      </PrimaryButton>
    </Animated.View>
  );
};
