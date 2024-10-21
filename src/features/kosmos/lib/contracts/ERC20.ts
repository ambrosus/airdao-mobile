// TODO: remove these function & extract into common contracts
import Config from '@constants/config';
import { Token } from '@features/kosmos/types';
import { ethers } from 'ethers';
import { ERC20_BALANCE } from '../abi/ERC20_BALANCE';

interface BalanceArgs {
  ownerAddress: string;
  token: Token;
}

export async function getBalanceOf({ ownerAddress, token }: BalanceArgs) {
  const provider = new ethers.providers.JsonRpcProvider(Config.NETWORK_URL);

  if (token.symbol === 'AMB') return await provider.getBalance(ownerAddress);

  const contract = new ethers.Contract(
    token.contractAddress,
    ERC20_BALANCE,
    provider
  );

  return await contract.balanceOf(ownerAddress);
}
