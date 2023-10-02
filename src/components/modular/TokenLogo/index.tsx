import React from 'react';
import {
  AirDAOTokenLogo,
  BUSDLogo,
  EthereumLogo,
  HeraPoolTokenLogo,
  TetherLogo,
  USDCoinLogo
} from '@components/svg/icons';

export const TokenLogo = ({ token }: { token: string }) => {
  switch (token) {
    case 'AirDAO':
      return <AirDAOTokenLogo />;
    case 'Ethereum':
      return <EthereumLogo />;
    case 'BUSD Token':
      return <BUSDLogo />;
    case 'USD Coin':
      return <USDCoinLogo />;
    case 'Tether':
      return <TetherLogo />;
    case '':
      return <HeraPoolTokenLogo />;
    default:
      return <AirDAOTokenLogo />;
  }
};
