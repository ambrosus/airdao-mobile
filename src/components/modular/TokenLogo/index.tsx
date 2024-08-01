import React, { useMemo } from 'react';
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
import { CryptoCurrencyCode } from '@appTypes';
import NFTIcon from '@components/svg/icons/NFTIcon';
import Config from '@constants/config';
import { Token } from '@models/Token';
import { useBridgeContextData } from '@features/bridge/context';

export interface TokenLogoProps {
  token?: string;
  scale?: number;
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
  const { selectedAccount } = useBridgeContextData();
  const tokenName = useMemo(() => {
    if (address) {
      if (selectedAccount?.address === address) {
        return 'airdao';
      } else {
        return (
          Config.ALL_TOKENS.find((token: Token) => token.address === address)
            ?.name ?? 'unknown'
        );
      }
    } else {
      return token;
    }
  }, [address, selectedAccount?.address, token]);

  switch (tokenName?.toLowerCase()) {
    case CryptoCurrencyCode.AMB.toLowerCase():
    case CryptoCurrencyCode.SAMB.toLowerCase():
    case 'airdao': {
      if (overrideIconVariants.amb === 'white') {
        return <AirdaoWhiteIcon scale={scale} />;
      }
      return <AirdaoBlueIcon scale={scale} />;
    }
    case CryptoCurrencyCode.ETH.toLowerCase():
    case 'ethereum':
    case 'weth':
      return (
        <EthTokenIcon scale={scale} fillColor={overrideIconVariants.eth} />
      );
    case CryptoCurrencyCode.BUSD.toLowerCase():
    case 'busd token':
    case 'wbnb':
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
    default:
      return <UnknownTokenIcon scale={scale} />;
  }
};
