import { GetBalanceModel } from '@lib/bridgeSDK/models/types';
import { ethers } from 'ethers';
import { currentProvider } from './currentProveder';
import { getBalanceABI } from '@lib/bridgeSDK/abi';

export async function getBridgeBalance({
  from,
  token,
  ownerAddress
}: GetBalanceModel) {
  const provider = await currentProvider(from);
  if (!ownerAddress) {
    return null;
  }

  if (token.isNativeCoin) {
    return provider?.getBalance(ownerAddress);
  }
  const contract = new ethers.Contract(token.address, getBalanceABI, provider);
  return await contract.balanceOf(ownerAddress);
}
