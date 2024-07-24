import { BigNumber, ethers } from 'ethers';

type Signer = ethers.Signer & { address: string };

export interface PurchaseArgs {
  recipient: Signer;
  referrer: Signer;
  id: string;
  amount: string;
  minAmountOut: string | BigNumber;
  vestingType: string;
}
