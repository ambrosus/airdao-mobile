import { Image } from 'react-native';
import { Row, Spacer, Text } from '@components/base';
import { WalletIcon } from '@components/svg/icons/v2';
import { COLORS, CreditCardBg } from '@constants/colors';
import { WalletDBModel } from '@database';
import { StringUtils, moderateScale, scale } from '@utils';
import { styles } from './styles';

interface WalletItemProps {
  wallet: WalletDBModel;
  walletAddress: string;
  isSelectedWallet: boolean;
  index: number;
}

export const WalletItem = (props: WalletItemProps) => {
  const { wallet, isSelectedWallet, index, walletAddress } = props;
  const bgIndex = index % CreditCardBg.length;
  return (
    <Row
      alignItems="center"
      justifyContent="space-between"
      style={styles.container}
    >
      <Row alignItems="center" width={scale(224)}>
        <WalletIcon color={CreditCardBg[bgIndex]} scale={1.1} />
        <Spacer value={scale(16)} horizontal />
        <Text
          fontSize={16}
          fontFamily="Inter_500Medium"
          color={COLORS.neutral800}
          numberOfLines={1}
        >
          {wallet.name ||
            StringUtils.formatAddress(walletAddress, 7, 7) ||
            'Wallet'}
        </Text>
      </Row>
      <Row alignItems="center">
        {isSelectedWallet && (
          <Image
            source={require('@assets/icons/checkmark-circle.png')}
            style={{ height: moderateScale(20), width: moderateScale(20) }}
          />
        )}
        <Spacer value={scale(16)} horizontal />
      </Row>
    </Row>
  );
};
