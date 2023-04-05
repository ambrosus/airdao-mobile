export interface ExplorerInfoDTO {
  network: 'production';
  timestamp: number;
  avgBlockTime: number;
  lastBlock: {
    number: number;
    hash: string;
    timestamp: number;
  };
  blocksBaseReward: {
    wei: string;
    ether: number;
  };
  totalApollosStake: {
    wei: string;
    ether: number;
  };
  totalAtlasesStake: {
    wei: string;
    ether: number;
  };
  apollos: {
    total: number;
    online: number;
    offline: number;
    connecting: number;
  };
  atlases: {
    total: number;
  };
  hermeses: {
    total: number;
  };
  accounts: {
    total: number;
    contracts: number;
    withBalance: number;
  };
  bundleCost: {
    wei: string;
    ether: number;
  };
  transactions: {
    total: number;
    pending: number;
  };
  validatorsPool: number;
  avgBlockSize: number;
  avgBlockGasUsed: number;
  avgBlockGasLimit: number;
  avgBlockTransactions: number;
  addressesWithBalance: number;
  totalContracts: number;
  bundlesActivity: number;
  totalBundles: number;
  totalAssets: number;
  totalEvents: number;
  totalSupply: number;
}
