export interface GetBalanceArgs {
  tokenAddress: string;
  ownerAddress: string;
}

export interface GetAllowanceArgs {
  tokenAddress: string;
  privateKey: string;
  amount: string;
  spenderAddress: string;
  contractAddress?: string;
  abi?: unknown[];
}

export type SetAllowanceArgs = GetAllowanceArgs & {
  estimateGas?: boolean;
};
