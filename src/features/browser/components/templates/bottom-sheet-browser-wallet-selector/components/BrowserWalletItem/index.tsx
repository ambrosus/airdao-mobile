import { useMemo } from 'react';
import { View } from 'react-native';
import { formatEther } from 'ethers/lib/utils';
import { useTranslation } from 'react-i18next';
import { CryptoCurrencyCode } from '@appTypes';
import { Row, Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { WalletDBModel } from '@database';
import { useBalanceOfAddress, useUSDPrice } from '@hooks';
import { NumberUtils, scale, StringUtils } from '@utils';
import { styles } from './styles';

interface BrowserWalletItemProps {
  wallet: WalletDBModel;
  walletAddress: string;
  isSelectedWallet: boolean;
  iconScale?: number;
  itemIndex: number;
}

export const BrowserWalletItem = ({
  walletAddress,
  itemIndex,
  wallet,
  isSelectedWallet
}: BrowserWalletItemProps) => {
  const { t } = useTranslation();
  const { data: selectedAccountBalance } = useBalanceOfAddress(walletAddress);
  const usdBalance = useUSDPrice(selectedAccountBalance.ether);

  const balance = useMemo(() => {
    return {
      crypto: formatEther(selectedAccountBalance.wei),
      usd: usdBalance
    };
  }, [selectedAccountBalance.wei, usdBalance]);

  const ActiveLabel = () => (
    <View style={styles.activeLabel}>
      <Text color={COLORS.success700} fontSize={scale(12)}>
        {t('kosmos.status.active')}
      </Text>
    </View>
  );

  return (
    <Row
      justifyContent="space-between"
      style={{
        ...styles.main,
        borderColor: COLORS[isSelectedWallet ? 'success300' : 'neutral300']
      }}
    >
      <View>
        <Row>
          <Text fontSize={scale(16)} color={COLORS.neutral900}>
            {wallet.name || `Account ${itemIndex + 1}`}
          </Text>
          {isSelectedWallet && (
            <>
              <Spacer horizontal value={scale(10)} />
              <ActiveLabel />
            </>
          )}
        </Row>
        <Spacer value={scale(5)} />
        <Text fontSize={scale(15)}>
          {StringUtils.formatAddress(walletAddress, 5, 5)}
        </Text>
      </View>
      <View style={styles.textWrapper}>
        <Text style={styles.text}>
          ${NumberUtils.numberToTransformedLocale(balance.usd)}
        </Text>
        <Row>
          <Text style={styles.text}>
            {NumberUtils.numberToTransformedLocale(balance.crypto)}{' '}
            {CryptoCurrencyCode.ASC}
          </Text>
        </Row>
      </View>
    </Row>
  );
};
