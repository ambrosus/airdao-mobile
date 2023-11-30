import React from 'react';
import {
  AirBondIcon,
  AirdaoBlueIcon,
  AirdaoWhiteIcon,
  BusdIcon,
  EthTokenIcon,
  FirepotIcon,
  GanymedeIcon,
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
  switch (token.toLowerCase()) {
    case 'airDAO':
      if (overrideIconVariants.amb === 'white') {
        return <AirdaoWhiteIcon scale={scale} />;
      }
      return <AirdaoBlueIcon scale={scale} />;
    case AirDAODictTypes.Code.ETH:
    case 'ethereum':
      return <EthTokenIcon scale={scale} />;
    case AirDAODictTypes.Code.BUSD:
    case 'busd token':
      return <BusdIcon scale={scale} />;
    case AirDAODictTypes.Code.USDC:
    case 'usd coin':
      return <UsdcIcon scale={scale} />;
    case AirDAODictTypes.Code.Tether:
    case 'tether usd':
      return <TetherIcon scale={scale} />;
    case 'ganymede pool token':
      return <GanymedeIcon scale={scale} />;
    case 'plutus pool token':
      return <PlutusIcon scale={scale} />;
    case 'hera pool token':
      return <HeraPoolIcon scale={scale} />;
    case 'firepot-lp-token':
      return <FirepotIcon scale={scale} />;
    case 'airbond':
      return <AirBondIcon scale={scale} />;
    default:
      return <AirdaoBlueIcon scale={scale} />;
  }
};
