import Web3 from 'web3';
import { TransactionConfig } from 'web3-core';
import erc20 from './erc20';

const WEB3_LINK = 'https://network.ambrosus.io';

class TransferDispatcher {
  private web3: Web3;

  constructor() {
    this.web3 = new Web3(new Web3.providers.HttpProvider(WEB3_LINK));
    this.web3.eth.transactionPollingTimeout = 60;
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
    privateKey: string,
    recipient: string,
    amountInEther: string,
    tokenAddress?: string
  ): Promise<number> {
    // Get account
    const account = this.web3.eth.accounts.privateKeyToAccount(privateKey);
    // Get transaction config
    const txObject = await this.prepareTransactionConfig(
      account.address,
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
    // return gasPrice * GAS_LIMIT;
  }

  async sendTx(
    privateKey: string,
    recipient: string,
    amountInEther: string,
    tokenAddress?: string
  ): Promise<string> {
    try {
      // Get account
      const account = this.web3.eth.accounts.privateKeyToAccount(privateKey);
      // Prepare transaction config
      const txConfig = await this.prepareTransactionConfig(
        account.address,
        recipient,
        amountInEther,
        tokenAddress
      );
      // Sign transaction
      const signedTx = await this.web3.eth.accounts.signTransaction(
        txConfig,
        account.privateKey
      );
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
