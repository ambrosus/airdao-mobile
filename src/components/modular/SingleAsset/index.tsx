import React, { useMemo } from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import { Row, Spacer, Text } from '@components/base';
import { scale } from '@utils/scaling';
import { COLORS } from '@constants/colors';
import { useUSDPrice } from '@hooks';
import { Token } from '@models';
import { TokenLogo, TokenLogoProps } from '../TokenLogo';
import { NumberUtils } from '@utils/number';
import { CryptoCurrencyCode } from '@appTypes';
import { StringUtils } from '@utils/string';
import { StringValidators } from '@utils';

interface SingleAssetProps {
  token: Token;
  overrideIconVariants?: TokenLogoProps['overrideIconVariants'];
}

export const SingleAsset = ({
  token,
  overrideIconVariants
}: SingleAssetProps): JSX.Element => {
  const { name, balance, symbol, address, tokenNameFromDatabase } = token;

  const isNFT = symbol === CryptoCurrencyCode.NFT;
  const usdPrice = useUSDPrice(balance.ether, symbol);

  const tokenUSDBalance = useMemo(() => {
    return isNFT
      ? `${balance.wei} ${symbol}s`
      : `$${NumberUtils.numberToTransformedLocale(usdPrice.toString())}`;
  }, [balance.wei, isNFT, symbol, usdPrice]);

  const tokenBalance = balance.formattedBalance;

  const tokenNameOrAddress = useMemo(() => {
    const isAddress = StringValidators.isStringAddress(name);
    return StringUtils.formatAddress(isAddress ? name : name || address, 5, 6);
  }, [address, name]);

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
              {tokenNameOrAddress}
            </Text>
            <Spacer value={scale(2)} />
            <Text
              fontFamily="Inter_600SemiBold"
              fontSize={13}
              color={COLORS.neutral400}
            >
              {NumberUtils.numberToTransformedLocale(tokenBalance)}{' '}
              {symbol || 'tokens'}
            </Text>
          </View>
        </Row>
        {usdPrice >= 0 && (
          <Text
            fontFamily="Inter_400Regular"
            fontSize={16}
            color={COLORS.neutral800}
          >
            {tokenUSDBalance}
          </Text>
        )}
      </Row>
    </View>
    // <View style={styles.container}>
    //   <Row>
    //     <View style={styles.logo}>
    //       <TokenLogo
    //         token={tokenNameFromDatabase}
    //         overrideIconVariants={overrideIconVariants}
    //       />
    //     </View>
    //     <Spacer horizontal value={scale(8)} />
    //     <View style={styles.item}>
    //       <Row justifyContent="space-between" alignItems="center">
    //         <Text
    //           fontFamily="Inter_500Medium"
    //           fontSize={16}
    //           color={COLORS.neutral800}
    //         >
    //           {name || address}
    //         </Text>
    //         {usdPrice >= 0 && (
    //           <Text
    //             fontFamily="Inter_400Regular"
    //             fontSize={16}
    //             color={COLORS.neutral800}
    //           >
    //             {tokenUSDBalance}
    //           </Text>
    //         )}
    //       </Row>
    //       {!isNFT && (
    //         <>
    //           <Spacer horizontal value={scale(8)} />
    //           <Row justifyContent="space-between">
    //             <Text
    //               fontFamily="Inter_600SemiBold"
    //               fontSize={13}
    //               color={COLORS.neutral400}
    //             >
    //               {NumberUtils.limitDecimalCount(tokenBalance, 2)}{' '}
    //               {symbol || 'tokens'}
    //             </Text>
    //             <Text
    //               fontFamily="Inter_400Regular"
    //               fontSize={14}
    //               color={COLORS.neutral800}
    //             >
    //               {name === 'AMB' && (
    //                 <View style={{ paddingTop: verticalScale(3) }}>
    //                   <PercentChange
    //                     change={ambTokenData?.percentChange24H || 0}
    //                     fontSize={14}
    //                   />
    //                 </View>
    //               )}
    //             </Text>
    //           </Row>
    //         </>
    //       )}
    //     </View>
    //   </Row>
    // </View>
  );
};
