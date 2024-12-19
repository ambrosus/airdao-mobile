import { Methods, ContractNames } from '@airdao/airdao-bond';
import { ethers } from 'ethers';
// @ts-ignore
import { PurchaseArgs } from '@features/kosmos/types';

export const purchaseBonds = async (
  contracts: any,
  data: PurchaseArgs,
  tokenAddress: string
) => {
  try {
    // If the token is native, we need to send the amount with purchase transaction
    // Otherwise, we need to approve spend of ERC20 token
    const optionalArgs =
      tokenAddress === ethers.constants.AddressZero
        ? { value: data.amount }
        : {};

    const fixedTeller =
      data.vestingType === 'Fixed-expiry'
        ? ContractNames.FixedExpiryTeller
        : ContractNames.FixedTermTeller;

    if (tokenAddress !== ethers.constants.AddressZero) {
      const tx = await Methods.ERC20Approve(
        tokenAddress,
        contracts.getContractByName(fixedTeller).address,
        data.amount,
        contracts.signerOrProvider
      );
      await tx.wait();
    }

    return await Methods.bondTellerPurchase(
      contracts,
      fixedTeller,
      data.recipient.address,
      data.referrer.address,
      data.id,
      data.amount,
      data.minAmountOut,
      optionalArgs
    );
  } catch (error) {
    throw error;
  }
};
