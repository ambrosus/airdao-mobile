import { BigNumber, ethers } from 'ethers';

export async function errorByTxHash(
  txHash: string,
  provider: ethers.providers.Provider
) {
  const tx = await provider.getTransaction(txHash);
  if (!tx) throw new Error(`Transaction ${txHash} not found`);

  return await provider.call(
    {
      data: tx.data,
      value: tx.value,
      from: tx.from,
      to: tx.to,
      gasLimit: tx.gasLimit,
      gasPrice: tx.gasPrice
    },
    tx.blockNumber
  );
}

export function wrapProviderToError(provider: ethers.providers.Provider) {
  const oldCall = provider.call;
  provider.call = async (
    transaction: ethers.providers.TransactionRequest,
    blockTag?: ethers.providers.BlockTag
  ): Promise<string> => {
    try {
      return await oldCall.apply(provider, [transaction, blockTag]);
    } catch (e) {
      // throw e;
      throw parseError(e);
    }
  };

  const oldEstimateGas = provider.estimateGas;
  provider.estimateGas = async (
    transaction: ethers.providers.TransactionRequest
  ): Promise<BigNumber> => {
    try {
      return await oldEstimateGas.apply(provider, [transaction]);
    } catch (e) {
      await provider.call(transaction); // make callStatic request to get error text
      throw e; // shouldn't get here because callStatic should throw amb error
    }
  };

  return provider;
}

export class AmbErrorProviderWeb3 extends ethers.providers.Web3Provider {
  // Populates "from" if unspecified, and estimates the gas for the transaction
  async estimateGas(
    transaction: ethers.providers.TransactionRequest
  ): Promise<BigNumber> {
    try {
      return await super.estimateGas(transaction);
    } catch (e) {
      await this.call(transaction); // make callStatic request to get error text
      throw e; // shouldn't get here because callStatic should throw amb error
    }
  }

  // Populates "from" if unspecified, and calls with the transaction
  async call(
    transaction: ethers.providers.TransactionRequest,
    blockTag?: ethers.providers.BlockTag
  ): Promise<string> {
    try {
      return await super.call(transaction, blockTag);
    } catch (e) {
      throw parseError(e);
    }
  }
}

export class AmbErrorProvider extends ethers.providers.StaticJsonRpcProvider {
  // Populates "from" if unspecified, and estimates the gas for the transaction
  async estimateGas(
    transaction: ethers.providers.TransactionRequest
  ): Promise<BigNumber> {
    try {
      return await super.estimateGas(transaction);
    } catch (e) {
      await this.call(transaction); // make callStatic request to get error text
      throw e; // shouldn't get here because callStatic should throw amb error
    }
  }

  // Populates "from" if unspecified, and calls with the transaction
  async call(
    transaction: ethers.providers.TransactionRequest,
    blockTag?: ethers.providers.BlockTag
  ): Promise<string> {
    try {
      return await super.call(transaction, blockTag);
    } catch (e) {
      throw parseError(e);
    }
  }
}

function parseError(error: any): void {
  let ambError;
  try {
    ambError = _parseError(error);
  } catch (e) {
    console.warn('Error while parsing error', e);
    throw error;
  }

  throw ambError;
}

function _parseError(error: any): Error {
  if (error.code === 'CALL_EXCEPTION') error = error.error;
  if (error.code === 'SERVER_ERROR') error = error.error;
  if (error.code === -32603) error = error.data;

  if (error.code !== -32015) {
    console.warn('Not -32015 code', error);
    throw error;
  }
  if (!error.data.startsWith('Reverted 0x')) {
    console.warn('Not starts with Reverted 0x', error);
    throw error;
  }

  let reason = error.data.substring(9);
  // https://github.com/authereum/eth-revert-reason/blob/e33f4df82426a177dbd69c0f97ff53153592809b/index.js#L93
  // "0x08c379a0" is `Error(string)` method signature, it's called by revert/require
  if (reason.length < 138 || !reason.startsWith('0x08c379a0')) {
    console.warn('Not error signature', reason);
    throw error;
  }

  reason = ethers.utils.hexDataSlice(reason, 4);
  reason = ethers.utils.defaultAbiCoder.decode(['string'], reason);
  console.warn('Error provider successfully parse error: ', reason);
  return new Error(reason);
}
