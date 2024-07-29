export interface GetBalanceArgs {
  tokenAddress: string;
  ownerAddress: string;
}

export interface GetAllowanceArgs {
  tokenAddress: string;
  privateKey: string;
  amount: string;
  spenderAddress: string;
}
