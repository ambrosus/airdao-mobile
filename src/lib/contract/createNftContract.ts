import { ethers } from 'ethers';
import Config from '@constants/config';
import ABI from './nft.abi.json';

const nftContractAddress = '0x4Ae225f3dC55875dc64A96fdE2835A15d3bD872a';

export const provider = new ethers.providers.JsonRpcProvider(
  Config.NETWORK_URL
);

export const createNftContract = (providerOrSigner = provider) => {
  return new ethers.Contract(nftContractAddress, ABI, providerOrSigner);
};
