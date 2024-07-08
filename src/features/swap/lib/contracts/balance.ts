import { ethers } from 'ethers';
import { BalanceGettersArgs } from '@features/swap/types';
import { createAMBProvider } from '@features/swap/utils/contracts/instances';
import { ERC20_BALANCE } from '@features/swap/lib/abi';

export async function getBalanceOf({
  token,
  ownerAddress
}: BalanceGettersArgs) {
  try {
    const provider = createAMBProvider();
    if (token.symbol === 'AMB') {
      return await provider.getBalance(ownerAddress);
    }

    const contract = new ethers.Contract(
      token.address,
      ERC20_BALANCE,
      provider
    );

    return await contract.balanceOf(ownerAddress);
  } catch (error) {
    throw error;
  }
}
