import React from 'react';
import {
  AirBondIcon,
  AirdaoBlueIcon,
  AirdaoWhiteIcon,
  BusdIcon,
  EthTokenIcon,
  FirepotIcon,
  GanymadeIcon,
  HeraPoolIcon,
  PlutusIcon,
  TetherIcon,
  UsdcIcon
} from '@components/svg/icons';
import { AirDAODictTypes } from '@crypto/common/AirDAODictTypes';

export interface TokenLogoProps {
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
      if (overrideIconVariants.amb === 'white') {
        return <AirdaoWhiteIcon scale={scale} />;
      }
      return <AirdaoBlueIcon scale={scale} />;
    case AirDAODictTypes.Code.ETH:
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
      return <FirepotIcon scale={scale} />;
    case 'AirBond':
      return <AirBondIcon scale={scale} />;
    default:
      return <AirdaoBlueIcon scale={scale} />;
  }
};
