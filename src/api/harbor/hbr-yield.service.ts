import { Wallet, ethers } from 'ethers';
import { provider } from '@api/nft-contract-service';
import { showCriticalError } from '@components/CriticalErrorHandler';
import Config from '@constants/config';
import { IsNullableAccount } from '@entities/wallet/model/types';
import { AmbErrorProvider } from '@lib';
import { ERC20_ABI } from '@lib/erc20/abi/ERC20_ABI';
import {
  CustomAppEvents,
  sendFirebaseEvent
} from '@lib/firebaseEventAnalytics';
import { HBR_POOL } from './abi';

const createHBRLiquidityPoolContract = (
  providerOrSigner: Wallet | ethers.providers.JsonRpcProvider = provider
) => {
  return new ethers.Contract(
    Config.HBR_LIQUIDITY_POOL,
    HBR_POOL,
    providerOrSigner
  );
};

const createHBRTokenContract = (providerOrSigner = provider) => {
  return new ethers.Contract(
    Config.HBR_TOKEN_ADDRESS,
    ERC20_ABI,
    providerOrSigner
  );
};

const createSigner = (privateKey: string) => {
  const provider = new AmbErrorProvider(Config.NETWORK_URL, Config.CHAIN_ID);
  return new ethers.Wallet(privateKey, provider);
};

const handleServiceError = (e: any) => {
  showCriticalError({
    title: 'critical.error.harbor.header',
    message: 'critical.error.harbor.subheader'
  });
  throw e;
};

class HBRYieldService {
  private lpContract = createHBRLiquidityPoolContract();
  private tokenContract = createHBRTokenContract();

  async staked(address: string) {
    return await this.lpContract.getStake(address);
  }

  async rewards(address: string) {
    return await this.lpContract.getUserRewards(address);
  }

  async deposit(address: string) {
    return await this.lpContract.getDeposit(address);
  }

  async limitConfig() {
    return await this.lpContract.limitsConfig();
  }

  async liquidityPool() {
    return await this.lpContract.info();
  }

  async maxUserStakeLimit(address: string) {
    return await this.lpContract.getMaxUserStakeValue(address);
  }

  async allowance(address: string) {
    return await this.tokenContract.allowance(
      address,
      Config.HBR_LIQUIDITY_POOL
    );
  }

  async _deposit(
    amount: string,
    wallet: IsNullableAccount | undefined,
    privateKey: string,
    { estimateGas = false }: { estimateGas?: boolean } = {}
  ) {
    try {
      if (!wallet) throw Error('No wallet found!');

      const bnAmount = ethers.utils.parseEther(amount);
      const signer = createSigner(privateKey);
      const contract = createHBRLiquidityPoolContract(signer);

      if (estimateGas) {
        return await contract.estimateGas.deposit(bnAmount);
      }

      // Analytics initial point
      sendFirebaseEvent(CustomAppEvents.harbor_hbr_stake_start);
      const tx = await contract.deposit(bnAmount);
      const response = await tx.wait();

      if (response) {
        sendFirebaseEvent(CustomAppEvents.harbor_hbr_stake_finish);
        return response;
      }
    } catch (error) {
      const errorMessage =
        (error as { message: string }).message || JSON.stringify(error);
      sendFirebaseEvent(CustomAppEvents.harbor_hbr_stake_error, {
        harborHBRStakeError: errorMessage
      });
      return handleServiceError(error);
    }
  }

  async _depositAmb(
    amount: string,
    wallet: IsNullableAccount | undefined,
    privateKey: string,
    { estimateGas = false }: { estimateGas?: boolean } = {}
  ) {
    try {
      if (!wallet) throw Error('No wallet found!');

      const bnAmount = ethers.utils.parseEther(amount);
      const signer = createSigner(privateKey);
      const contract = createHBRLiquidityPoolContract(signer);

      if (estimateGas) {
        return await contract.estimateGas.stake(bnAmount, {
          value: bnAmount
        });
      }

      // Analytics initial point
      sendFirebaseEvent(CustomAppEvents.harbor_hbr_amb_stake_start);
      const tx = await contract.stake(bnAmount, { value: bnAmount });
      const response = await tx.wait();

      if (response) {
        sendFirebaseEvent(CustomAppEvents.harbor_hbr_amb_stake_finish);
        return response;
      }
    } catch (error) {
      const errorMessage =
        (error as { message: string }).message || JSON.stringify(error);
      sendFirebaseEvent(CustomAppEvents.harbor_hbr_amb_stake_error, {
        harborHbrAmbStakeError: errorMessage
      });
      return handleServiceError(error);
    }
  }

  async withdraw(
    deposit: ethers.BigNumber,
    privateKey: string,
    { estimateGas = false }: { estimateGas?: boolean } = {}
  ) {
    try {
      if (deposit.isZero()) throw Error('Deposit is too low');

      const signer = createSigner(privateKey);
      const contract = createHBRLiquidityPoolContract(signer);

      if (estimateGas) {
        return await contract.estimateGas.withdraw(deposit);
      }

      sendFirebaseEvent(CustomAppEvents.harbor_hbr_withdraw_start);
      const tx = await contract.withdraw(deposit);
      const response = await tx.wait();

      if (response) {
        sendFirebaseEvent(CustomAppEvents.harbor_hbr_withdraw_finish);
        return response;
      }
    } catch (error) {
      const errorMessage =
        (error as { message: string }).message || JSON.stringify(error);
      sendFirebaseEvent(CustomAppEvents.harbor_hbr_withdraw_error, {
        harborHbrWithdrawError: errorMessage
      });
      return handleServiceError(error);
    }
  }

  async unstake(
    stake: ethers.BigNumber,
    privateKey: string,
    { estimateGas = false }: { estimateGas?: boolean } = {}
  ) {
    try {
      if (stake.isZero()) throw Error('Deposit is too low');

      const signer = createSigner(privateKey);
      const contract = createHBRLiquidityPoolContract(signer);

      if (estimateGas) {
        return await contract.estimateGas.unstake(stake);
      }

      sendFirebaseEvent(CustomAppEvents.harbor_hbr_amb_withdraw_start);
      const tx = await contract.unstake(stake);
      const response = await tx.wait();

      if (response) {
        sendFirebaseEvent(CustomAppEvents.harbor_hbr_amb_withdraw_finish);
        return response;
      }
    } catch (error) {
      const errorMessage =
        (error as { message: string }).message || JSON.stringify(error);
      sendFirebaseEvent(CustomAppEvents.harbor_hbr_amb_withdraw_error, {
        harborHbrAmbWithdrawError: errorMessage
      });
      return handleServiceError(error);
    }
  }
}

export const hbrYieldService = new HBRYieldService();
