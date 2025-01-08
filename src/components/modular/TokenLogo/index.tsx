import React, { useMemo } from 'react';
import { CryptoCurrencyCode } from '@appTypes';
import {
  AirBondIcon,
  AirdaoBlueIcon,
  AirdaoWhiteIcon,
  AirDOGEIcon,
  ASTIcon,
  BusdIcon,
  EthTokenIcon,
  FirepotIcon,
  GanymedeIcon,
  HBRIcon,
  HeraPoolIcon,
  KosmosTokenIcon,
  LangFundIcon,
  PlutusIcon,
  TetherIcon,
  TokenXENAIcon,
  UnknownTokenIcon,
  UsdcIcon
} from '@components/svg/icons';
import { NFTIcon } from '@components/svg/icons/NFTIcon';
import { getTokenNameFromDatabase } from '@utils';

export interface TokenLogoProps {
  token?: string;
  scale?: number;
  isNativeCoin?: boolean | string;
  address?: string;
  overrideIconVariants?: {
    amb?: 'white' | 'blue';
    eth?: 'gray' | 'blue';
  };
}

export const TokenLogo = (props: TokenLogoProps) => {
  const {
    scale,
    token,
    address,
    overrideIconVariants = { amb: 'blue', eth: 'gray' }
  } = props;

  const tokenName = useMemo(() => {
    if (address) {
      return getTokenNameFromDatabase(address);
    } else {
      return token;
    }
  }, [address, token]);
  switch (tokenName?.toLowerCase()) {
    case CryptoCurrencyCode.AMB.toLowerCase():
    case CryptoCurrencyCode.SAMB.toLowerCase():
    case CryptoCurrencyCode.CollateralizedHarbor.toLowerCase():
    case CryptoCurrencyCode.SyntheticAmber.toLowerCase():
    case CryptoCurrencyCode.Test1.toLowerCase():
    case CryptoCurrencyCode.stAMB.toLowerCase():
    case CryptoCurrencyCode.StAMB.toLowerCase():
    case 'staked amb':
    case 'airdao': {
      if (overrideIconVariants.amb === 'white') {
        return <AirdaoWhiteIcon scale={scale} />;
      }
      return <AirdaoBlueIcon scale={scale} />;
    }
    case CryptoCurrencyCode.KOS.toLowerCase():
      return <KosmosTokenIcon scale={scale} />;
    case CryptoCurrencyCode.ADOGE.toLowerCase():
    case CryptoCurrencyCode.Airdoge.toLowerCase():
      return <AirDOGEIcon scale={scale} />;
    case CryptoCurrencyCode.ETH.toLowerCase():
    case 'ethereum':
    case 'weth':
    case 'wrapped ether':
      return (
        <EthTokenIcon scale={scale} fillColor={overrideIconVariants.eth} />
      );
    case CryptoCurrencyCode.BUSD.toLowerCase():
    case 'busd token':
    case 'wbnb':
    case 'wrapped bnb':
    case 'bsc':
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
    case 'nft':
      return <NFTIcon />;
    case CryptoCurrencyCode.ASTLP.toLowerCase():
    case CryptoCurrencyCode.AstraLiquidityPool.toLowerCase():
    case CryptoCurrencyCode.AST.toLowerCase():
    case CryptoCurrencyCode.Astra.toLowerCase():
      return <ASTIcon scale={scale} />;
    case CryptoCurrencyCode.Harbor.toLowerCase():
    case CryptoCurrencyCode.HBR.toLowerCase():
      return <HBRIcon scale={scale} />;
    case CryptoCurrencyCode.KosmosToken.toLowerCase():
    case 'kos':
      return <KosmosTokenIcon scale={scale} />;
    case CryptoCurrencyCode.XENA.toLowerCase():
      return <TokenXENAIcon scale={scale} />;
    default:
      return <UnknownTokenIcon scale={scale} />;
  }
};
