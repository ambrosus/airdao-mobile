import { ethers } from 'ethers';
import Config from '@constants/config';
import ABI from '@constants/nft-contract.abi.json';

export const provider = new ethers.providers.JsonRpcProvider(
  Config.NETWORK_URL
);

export const createNftContract = (providerOrSigner = provider) => {
  return new ethers.Contract(
    Config.NFT_CONTRACT_ADDRESS,
    ABI,
    providerOrSigner
  );
};

const getNftParams = async (address = ''): Promise<any> => {
  try {
    if (address) {
      const nftContract = createNftContract();
      const transferFilter = nftContract.filters.Transfer(null, address, null);
      if (address) {
        const userEvents = await nftContract.queryFilter(transferFilter);
        const lastUserEvents = userEvents[userEvents.length - 1];
        // @ts-ignore
        const tokenId = lastUserEvents?.args[2]._hex;
        const tokenUri = await nftContract.tokenURI(tokenId);
        return { tokenId, tokenUri };
      }
    }
  } catch (e) {
    return e;
  }
};

export const nftContractService = {
  getNftParams
};
