import React from 'react';
import { Image, ImageProps } from 'react-native';
import {
  AirBondIcon,
  AirdaoBlueIcon,
  BusdIcon,
  EthTokenIcon,
  GanymadeIcon,
  HeraPoolIcon,
  PlutusIcon,
  TetherIcon
} from '@components/svg/icons';
import { AirDAODictTypes } from '@crypto/common/AirDAODictTypes';

export interface TokenLogoProps extends Omit<ImageProps, 'source'> {
  token: string;
  overrideIconVariants?: {
    amb?: 'white' | 'blue';
  };
}

export const TokenLogo = (props: TokenLogoProps) => {
  const { token, overrideIconVariants = { amb: 'blue' } } = props;
  switch (token) {
    case 'AirDAO':
      return (
        <Image
          source={
            overrideIconVariants.amb === 'white'
              ? require('@assets/images/tokens/airdao-token-white.png')
              : require('@assets/images/tokens/airdao-token-blue.png')
          }
        />
      );
    case 'Ethereum':
      return <EthTokenIcon />;
    case AirDAODictTypes.Code.BUSD:
    case 'BUSD Token':
      return <BusdIcon />;
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
      return <TetherIcon />;
    case 'Ganymaede pool token':
      return <GanymadeIcon />;
    case 'Plutus pool token':
      return <PlutusIcon />;
    case 'Hera pool token':
      return <HeraPoolIcon />;
    case 'Firepot-LP-Token':
      return (
        <Image
          {...props}
          source={require('@assets/images/tokens/firepot-lp-token.png')}
        />
      );
    case 'AirBond':
      return <AirBondIcon />;
    default:
      return <AirdaoBlueIcon />;
  }
};
