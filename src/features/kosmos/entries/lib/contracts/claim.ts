import { Dispatch, SetStateAction } from 'react';
// @ts-ignore
import * as Bond from '@airdao/airdao-bond';
// @ts-ignore
import * as BondOld from 'airdao-bond-old';
import { ethers } from 'ethers';
// @ts-ignore
import { Toast, ToastType } from '@components/modular';
import Config from '@constants/config';
import { claimExpiredOrder } from '../../api';

interface ClaimBondsArgs {
  contracts: any;
  contractName: string;
  arg1: string;
  arg2: string;
  hash: string;
  privateKey: string;
  version: string;
  setIsOrderClaiming: Dispatch<SetStateAction<boolean>>;
}

export async function claimBond({
  contracts,
  contractName,
  arg1,
  arg2,
  hash,
  privateKey,
  version,
  setIsOrderClaiming
}: ClaimBondsArgs) {
  const provider = new ethers.providers.JsonRpcProvider(Config.NETWORK_URL);
  const signer = new ethers.Wallet(privateKey, provider);

  const contractsOld = new BondOld.Contracts(signer, Config.CHAIN_ID);
  const contract = version === 'v1' ? BondOld : Bond;

  try {
    const tx = await contract.Methods[
      contractName === 'BondFixedTermTeller'
        ? 'bondFixedTermTellerRedeem'
        : 'bondFixedExpiryTellerRedeem'
    ](version === 'v1' ? contractsOld : contracts, contractName, arg1, arg2);

    if (contractName !== 'BondFixedTermTeller') {
      claimExpiredOrder(signer.address, hash);
    }

    return await tx.wait();
  } catch (error) {
    console.error(error);
    console.error('claim bond error', error);
    // @ts-ignore
    if (error.code !== 'ACTION_REJECTED') {
      Toast.show({
        text: 'Error',
        type: ToastType.Failed
      });
    }
    throw error;
  } finally {
    setIsOrderClaiming(false);
  }
}
