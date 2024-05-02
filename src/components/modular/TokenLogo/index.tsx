import React from 'react';
import {
  AirBondIcon,
  AirdaoBlueIcon,
  AirdaoWhiteIcon,
  BSCIcon,
  BusdIcon,
  EthereumIcon,
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
import { CryptoCurrencyCode } from '@appTypes';
import NFTIcon from '@components/svg/icons/NFTIcon';

export interface TokenLogoProps {
  token: string;
  scale?: number;
  overrideIconVariants?: {
    amb?: 'white' | 'blue';
    eth?: 'gray' | 'blue';
  };
}

export const TokenLogo = (props: TokenLogoProps) => {
  const {
    scale,
    token,
    overrideIconVariants = { amb: 'blue', eth: 'gray' }
  } = props;
  switch (token.toLowerCase()) {
    case CryptoCurrencyCode.AMB.toLowerCase():
    case 'airdao': {
      if (overrideIconVariants.amb === 'white') {
        return <AirdaoWhiteIcon scale={scale} />;
      }
      return <AirdaoBlueIcon scale={scale} />;
    }
    case CryptoCurrencyCode.ETH.toLowerCase():
    case 'ethereum':
      if (overrideIconVariants.eth === 'blue') {
        return <EthereumIcon scale={scale} />;
      } else {
        return <EthTokenIcon scale={scale} />;
      }
    case CryptoCurrencyCode.BUSD.toLowerCase():
    case 'busd token':
      return <BusdIcon scale={scale} />;
    case CryptoCurrencyCode.USDC.toLowerCase():
    case 'usd coin':
      return <UsdcIcon scale={scale} />;
    case CryptoCurrencyCode.Tether.toLowerCase():
    case 'tether usd':
      return <TetherIcon scale={scale} />;
    case CryptoCurrencyCode.GanymedePoolToken.toLowerCase():
    case 'ganymede pool token':
      return <GanymedeIcon scale={scale} />;
    case CryptoCurrencyCode.PlutusPoolToken.toLowerCase():
    case 'plutus pool token':
      return <PlutusIcon scale={scale} />;
    case CryptoCurrencyCode.HeraPoolToken.toLowerCase():
    case 'hera pool token':
      return <HeraPoolIcon scale={scale} />;
    case CryptoCurrencyCode.FirepotLp.toLowerCase():
    case 'firepot-lp-token':
      return <FirepotIcon scale={scale} />;
    case CryptoCurrencyCode.Bond.toLowerCase():
    case 'airbond':
      return <AirBondIcon scale={scale} />;
    case CryptoCurrencyCode.LangOperation.toLowerCase():
    case 'operation funds lang inu':
      return <LangFundIcon scale={scale} />;
    case 'airdao nft':
      return <NFTIcon />;
    case 'bsc':
      return <BSCIcon scale={scale} />;
    default:
      return <UnknownTokenIcon scale={scale} />;
  }
};
