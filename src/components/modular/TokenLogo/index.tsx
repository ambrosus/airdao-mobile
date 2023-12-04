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
  LangFundIcon,
  PlutusIcon,
  TetherIcon,
  UnknownTokenIcon,
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
    case 'airdao':
      if (overrideIconVariants.amb === 'white') {
        return <AirdaoWhiteIcon scale={scale} />;
      }
      return <AirdaoBlueIcon scale={scale} />;
    case AirDAODictTypes.Code.ETH.toLowerCase():
    case 'ethereum':
      return <EthTokenIcon scale={scale} />;
    case AirDAODictTypes.Code.BUSD.toLowerCase():
    case 'busd token':
      return <BusdIcon scale={scale} />;
    case AirDAODictTypes.Code.USDC.toLowerCase():
    case 'usd coin':
      return <UsdcIcon scale={scale} />;
    case AirDAODictTypes.Code.Tether.toLowerCase():
    case 'tether usd':
      return <TetherIcon scale={scale} />;
    case AirDAODictTypes.Code.GanymedePoolToken.toLowerCase():
    case 'ganymede pool token':
      return <GanymedeIcon scale={scale} />;
    case AirDAODictTypes.Code.PlutusPoolToken.toLowerCase():
    case 'plutus pool token':
      return <PlutusIcon scale={scale} />;
    case AirDAODictTypes.Code.HeraPoolToken.toLowerCase():
    case 'hera pool token':
      return <HeraPoolIcon scale={scale} />;
    case AirDAODictTypes.Code.FirepotLp.toLowerCase():
    case 'firepot-lp-token':
      return <FirepotIcon scale={scale} />;
    case AirDAODictTypes.Code.Bond.toLowerCase():
    case 'airbond':
      return <AirBondIcon scale={scale} />;
    case AirDAODictTypes.Code.LangOperation.toLowerCase():
    case 'operation funds lang inu':
      return <LangFundIcon scale={scale} />;
    default:
      return <UnknownTokenIcon scale={scale} />;
  }
};
