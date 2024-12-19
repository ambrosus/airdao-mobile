import { BigNumberish, ethers } from 'ethers';
import { formatBridgeAddresses, getPairs } from './config';
import { getFeeData, setAllowance, withdraw } from './withdraws';
import { bridgeContract } from '../abi/sdkABI';
import {
  BridgeAddresses,
  Config,
  EnvData,
  FeeData,
  Network,
  Token
} from '../models/types';

export class BridgeSDK {
  config: Config;
  envData: EnvData;
  bridgeAddresses: BridgeAddresses;

  constructor(config: Config, envData: EnvData) {
    this.config = config;
    this.envData = envData;
    this.bridgeAddresses = formatBridgeAddresses(config);
  }

  getPairs(sourceNetwork: Network, destinationNetwork: Network) {
    return getPairs(this.config, sourceNetwork, destinationNetwork);
  }

  async getFeeData(
    tokenFrom: Token,
    tokenTo: Token,
    amountTokens: string,
    isMax: boolean
  ) {
    return getFeeData(
      tokenFrom,
      tokenTo,
      amountTokens,
      isMax,
      this.envData.relayUrls
    );
  }

  async withdraw(
    tokenFrom: Token,
    tokenTo: Token,
    toAddress: string,
    amountTokens: string,
    feeData: FeeData,
    signer: ethers.Signer,
    getGasFee = false
  ) {
    const bridgeContract = this.getBridgeForTokens(tokenFrom, tokenTo).connect(
      signer
    );
    const withdrawData = {
      tokenFrom,
      tokenTo,
      toAddress,
      amountTokens,
      feeData,
      bridge: bridgeContract
    };
    return withdraw({
      withdrawParams: withdrawData,
      getGasFee
    });
  }

  async setAllowance(
    token: Token,
    signer: ethers.Signer,
    spender: string,
    amount: BigNumberish
  ) {
    return setAllowance(token, spender, signer, amount);
  }

  getBridgeForTokens(tokenFrom: Token, tokenTo: Token) {
    const address = this.bridgeAddresses[tokenFrom.network][tokenTo.network];
    return bridgeContract.attach(address);
  }
}
