import { useMemo } from 'react';
import { View } from 'react-native';
import { Row, Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { Token } from '@models';
import { NumberUtils, scale } from '@utils';
import { TokenLogo, TokenLogoProps } from '../TokenLogo';
import { styles } from './styles';

interface SingleAssetProps {
  token: Token;
  overrideIconVariants?: TokenLogoProps['overrideIconVariants'];
}

export const SingleAssetNFT = ({
  token,
  overrideIconVariants
}: SingleAssetProps): JSX.Element => {
  const { name, balance, tokenNameFromDatabase } = token;

  const tokenBalance = balance.formattedBalance;

  const pluralSupportedSymbol = useMemo(() => {
    return +tokenBalance > 1 ? 'NFTs' : 'NFT';
  }, [tokenBalance]);

  return (
    <View style={styles.container}>
      <Row alignItems="center" justifyContent="space-between">
        <Row alignItems="center">
          <TokenLogo
            token={tokenNameFromDatabase}
            overrideIconVariants={overrideIconVariants}
          />
          <Spacer horizontal value={scale(8)} />
          <View>
            <Text
              fontFamily="Inter_500Medium"
              fontSize={16}
              color={COLORS.neutral800}
            >
              {name}
            </Text>
          </View>
        </Row>
        <Text
          fontFamily="Inter_600SemiBold"
          fontSize={13}
          color={COLORS.neutral400}
        >
          {NumberUtils.numberToTransformedLocale(tokenBalance)}{' '}
          {pluralSupportedSymbol}
        </Text>
      </Row>
    </View>
  );
};
