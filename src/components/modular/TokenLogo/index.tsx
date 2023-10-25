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
  TetherIcon,
  UsdcIcon
} from '@components/svg/icons';
import { AirDAODictTypes } from '@crypto/common/AirDAODictTypes';
import { moderateScale } from '@utils/scaling';

export interface TokenLogoProps extends Omit<ImageProps, 'source'> {
  token: string;
  scale?: number;
  overrideIconVariants?: {
    amb?: 'white' | 'blue';
  };
}

export const TokenLogo = (props: TokenLogoProps) => {
  const { scale, token, overrideIconVariants = { amb: 'blue' } } = props;
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
      return <EthTokenIcon scale={scale} />;
    case AirDAODictTypes.Code.BUSD:
    case 'BUSD Token':
      return <BusdIcon scale={scale} />;
    case AirDAODictTypes.Code.USDC:
    case 'USD Coin':
      return <UsdcIcon scale={scale} />;
    case AirDAODictTypes.Code.Tether:
    case 'Tether USD':
      return <TetherIcon scale={scale} />;
    case 'Ganymaede pool token':
      return <GanymadeIcon scale={scale} />;
    case 'Plutus pool token':
      return <PlutusIcon scale={scale} />;
    case 'Hera pool token':
      return <HeraPoolIcon scale={scale} />;
    case 'Firepot-LP-Token':
      return (
        <Image
          {...props}
          style={{ width: moderateScale(96), height: moderateScale(96) }}
          source={require('@assets/images/tokens/firepot-lp-token.png')}
        />
      );
    case 'AirBond':
      return <AirBondIcon scale={scale} />;
    default:
      return <AirdaoBlueIcon scale={scale} />;
  }
};
