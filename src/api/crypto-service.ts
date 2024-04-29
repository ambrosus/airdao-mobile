import AddressProcessor from '@lib/crypto/AddressProcessor';
import { CryptoUtils } from '@utils/crypto';
import { createNftContract, provider } from '@lib/contract/createNftContract';
import { Cache, CacheKey } from '@lib/cache';
import { ethers } from 'ethers';

const getBalanceOfAddress = async (address: string) => {
  try {
    const weiBalance = await AddressProcessor.getBalance(address);
    const etherBalance = await CryptoUtils.toEther(weiBalance);
    return { wei: weiBalance, ether: etherBalance };
  } catch (error) {
    throw error;
  }
};

export const checkNft = async (address) => {
  // console.log('selected address:', address);
  if (!address) return;
  try {
    const nftContract = createNftContract();
    const balance = await nftContract.balanceOf(address);
    return balance;
  } catch (e) {
    // console.log('CONTRACT-ERROR', e);
  }
};

export const getTransfer = async (address) => {
  try {
    // console.log('address', address);
    const nftContract = createNftContract();
    // console.log('contract->', nftContract);
    const transferFilter = nftContract.filters.Transfer(null, address, null);
    // console.log('filter:', transferFilter);
    if (address) {
      const events = await nftContract.queryFilter(transferFilter);
      const tokenId = events[0].args[2]._hex;
      const tokenUri = await nftContract.tokenURI(tokenId);
      // console.log('--->', address, tokenId, tokenUri);
      return { tokenId, tokenUri };
    }
  } catch (e) {
    // console.log('FILTER - error', e);
    return {
      tokenId: null,
      tokenUri: null
    };
  }
};

export const burnNFT = async (wallet) => {
  // console.log(wallet);
  const address = wallet.address;
  try {
    const { tokenId } = await getTransfer(address);
    if (tokenId) {
      const walletHash = wallet.hash;

      const privateKey = (await Cache.getItem(
        `${CacheKey.WalletPrivateKey}-${walletHash}`
      )) as string;
      const signer = new ethers.Wallet(privateKey, provider);
      const nftContract = createNftContract(signer);
      const burnTxInfo = await nftContract.burn(tokenId);
      const receipt = await burnTxInfo.wait();
      return receipt;
      // console.log('result-->', receipt);
    }
  } catch (e) {
    // console.log('BURN - ERROR', e);
  }
};

export const cryptoService = {
  getBalanceOfAddress
};
