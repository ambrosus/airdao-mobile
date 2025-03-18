import { createPublicClient, http } from 'viem';
import Config from '@constants/config';
import { MAINNET, TESTNET } from './instances';

export const Chain = {
  16718: MAINNET,
  22040: TESTNET
};

export const Verifiers = {
  GOOGLE: '',
  APPLE: ''
};

export const createNetworkProvider = () => {
  return createPublicClient({
    chain: Chain[Config.CHAIN_ID as keyof typeof Chain],
    transport: http()
  });
};
