import Web3 from 'web3';
import { TransactionConfig } from 'web3-core';
import erc20 from './erc20';
import Config from '@constants/config';

class TransferDispatcher {
  private web3: Web3;

  constructor() {
    this.web3 = new Web3(
      new Web3.providers.HttpProvider(Config.WEB3_NETWORK_URL)
    );
    this.web3.eth.transactionPollingTimeout = 15;
  }

  private async prepareTransactionConfig(
    from: string,
    to: string,
    amountInEther: string,
    tokenAddress?: string
  ): Promise<TransactionConfig> {
    // Get nonce
    const nonce = await this.web3.eth.getTransactionCount(from);
    // Get gas price
    const gasPrice = await this.web3.eth.getGasPrice();

    let txObject: TransactionConfig = {
      from,
      to,
      gasPrice,
      nonce
    };

    if (tokenAddress) {
      // send ERC-20 token
      const transactionObject = await this.getTransactionObjectERC20(
        tokenAddress,
        to,
        amountInEther
      );
      txObject = {
        ...txObject,
        ...transactionObject
      };
    } else {
      // send AMB
      txObject = {
        ...txObject,
        ...this.getTransactionObjectEthers(to, amountInEther)
      };
    }

    // Get the estimated gas
    const gasLimit = await this.web3.eth.estimateGas(txObject);
    txObject.gas = gasLimit;
    return txObject;
  }

  async getEstimatedFee(
    sender: string,
    recipient: string,
    amountInEther: string,
    tokenAddress?: string
  ): Promise<number> {
    // Get transaction config
    const txObject = await this.prepareTransactionConfig(
      sender,
      recipient,
      amountInEther,
      tokenAddress
    );

    return Number(
      this.web3.utils.fromWei(
        (
          Number(txObject.gas || '0') * Number(txObject.gasPrice || '0')
        ).toString()
      )
    );
  }

  async signTransaction(txConfig: TransactionConfig, privateKey: string) {
    return await this.web3.eth.accounts.signTransaction(txConfig, privateKey);
  }

  async sendTx(
    privateKey: string,
    sender: string,
    recipient: string,
    amountInEther: string,
    tokenAddress?: string
  ): Promise<string> {
    try {
      // Prepare transaction config
      const txConfig = await this.prepareTransactionConfig(
        sender,
        recipient,
        amountInEther,
        tokenAddress
      );
      // Sign transaction
      const signedTx = await this.signTransaction(txConfig, privateKey);
      // Send transaction
      const txReceipt = await this.web3.eth.sendSignedTransaction(
        signedTx.rawTransaction as string
      );
      // @ts-ignore
      return txReceipt.transactionHash;
    } catch (error) {
      //@ts-ignore
      if (error.message.includes('Returned error: Insufficient funds.')) {
        throw Error('INSUFFICIENT_FUNDS');
      }
      throw error;
    }
  }

  private getTransactionObjectEthers(recipient: string, amountInEther: string) {
    return {
      to: recipient,
      value: this.web3.utils.toWei(amountInEther, 'ether')
      // gas: GAS_LIMIT
    };
  }

  private async getTransactionObjectERC20(
    tokenAddress: string,
    recipient: string,
    amountInEther: string
  ) {
    // @ts-ignore
    const tokenContract = new this.web3.eth.Contract(erc20.ERC20, tokenAddress);
    const amountInBaseUnits = this.web3.utils.toWei(amountInEther);
    return {
      to: tokenAddress,
      data: tokenContract.methods
        .transfer(recipient, amountInBaseUnits)
        .encodeABI()
    };
  }
}

export default new TransferDispatcher();
