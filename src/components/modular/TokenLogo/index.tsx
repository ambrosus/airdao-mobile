import React from 'react';
import { Image, ImageProps } from 'react-native';
import { AirDAOTokenLogo, BUSDLogo, EthereumLogo } from '@components/svg/icons';
import { AirDAODictTypes } from '@crypto/common/AirDAODictTypes';

interface TokenLogoProps extends Omit<ImageProps, 'source'> {
  token: string;
}

export const TokenLogo = (props: TokenLogoProps) => {
  const { token } = props;
  switch (token) {
    case 'AirDAO':
      return <AirDAOTokenLogo />;
    case 'Ethereum':
      return <EthereumLogo />;
    case AirDAODictTypes.Code.BUSD:
    case 'BUSD Token':
      return <BUSDLogo />;
    case AirDAODictTypes.Code.USDC:
    case 'USD Coin':
      return (
        <Image
          {...props}
          source={require('@assets/images/tokens/usd-coin.png')}
        />
      );
    case AirDAODictTypes.Code.Tether:
    case 'Tether USD':
      return (
        <Image
          {...props}
          source={require('@assets/images/tokens/tether-token.png')}
        />
      );
    case 'Ganymaede pool token':
      return (
        <Image
          {...props}
          source={require('@assets/images/tokens/ganymade-token.png')}
        />
      );
    case 'Plutus pool token':
      return (
        <Image
          {...props}
          source={require('@assets/images/tokens/plutus-token.png')}
        />
      );
    case 'Hera pool token':
      return (
        <Image
          {...props}
          source={require('@assets/images/tokens/hera-pool-token.png')}
        />
      );
    case 'Firepot-LP-Token':
      return (
        <Image
          {...props}
          source={require('@assets/images/tokens/firepot-lp-token.png')}
        />
      );
    case 'AirBond':
      return (
        <Image
          {...props}
          source={require('@assets/images/tokens/airbond-token.png')}
        />
      );
    default:
      return <AirDAOTokenLogo />;
  }
};
