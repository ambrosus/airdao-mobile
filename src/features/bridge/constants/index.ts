import { Token } from '@lib/bridgeSDK/models/types';
import { CryptoCurrencyCode } from '@appTypes';

export const DEFAULT_AMB_NETWORK = {
  side: '0x0000000000',
  amb: '1x1111111111',
  id: 'amb',
  name: 'AirDAO'
};
export const DEFAULT_ETH_NETWORK = {
  side: '1x1111111111',
  amb: '0x0000000000',
  id: 'eth',
  name: 'Ethereum'
};

export const DEFAULT_TOKEN_FROM: Token = {
  address: '0x2b2d892C3fe2b4113dd7aC0D2c1882AF202FB28F',
  balance: '0',
  bridgeNetwork: 'eth',
  decimals: 18,
  isNativeCoin: true,
  name: 'AirDAO (NATIVE)',
  network: 'amb',
  symbol: CryptoCurrencyCode.AMB
};

export const DEFAULT_TOKEN_TO = {
  address: '0xf4fB9BF10E489EA3Edb03E094939341399587b0C',
  bridgeNetwork: 'eth',
  balance: '0',
  decimals: 18,
  isNativeCoin: false,
  name: 'AirDAO',
  network: 'eth',
  symbol: CryptoCurrencyCode.ETH
};

export const DEFAULT_TOKEN_PAIRS = {
  name: 'amb->eth',
  pairs: [DEFAULT_TOKEN_FROM, DEFAULT_TOKEN_TO],
  renderTokenItem: DEFAULT_TOKEN_FROM
};

export const BRIDGE_ERROR_CODES = {
  UNPREDICTABLE_GAS_LIMIT: 'UNPREDICTABLE_GAS_LIMIT',
  INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS'
};

export const METHODS_FROM_ERRORS = {
  ESTIMATE_GAS: 'estimateGas',
  SEND_TRANSACTION: 'sendTransaction'
};
