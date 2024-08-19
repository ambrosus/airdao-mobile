import { ethers } from 'ethers';
import { BalanceGettersArgs } from '@features/swap/types';
import { createAMBProvider } from '@features/swap/utils/contracts/instances';
import { BALANCE } from '@features/swap/lib/abi';

export async function getBalanceOf({
  token,
  ownerAddress
}: BalanceGettersArgs) {
  try {
    const provider = createAMBProvider();
    if (token.address === ethers.constants.AddressZero) {
      return await provider.getBalance(ownerAddress);
    }

    const contract = new ethers.Contract(token.address, BALANCE, provider);

    return await contract.balanceOf(ownerAddress);
  } catch (error) {
    throw error;
  }
}
