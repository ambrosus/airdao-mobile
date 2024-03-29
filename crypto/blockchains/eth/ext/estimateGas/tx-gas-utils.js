import EthQuery from 'ethjs-query';
import { hexToBn, BnMultiplyByFraction, bnToHex } from './util';
import { addHexPrefix } from 'ethereumjs-util';
const SIMPLE_GAS_COST = '0x5208'; // Hex for 21000, cost of a simple send.

const TRANSACTION_NO_CONTRACT_ERROR_KEY = 'transactionErrorNoContract';

/**
 tx-gas-utils are gas utility methods for Transaction manager
 its passed ethquery
 and used to do things like calculate gas of a tx.
 @param {Object} provider - A network provider.
 */

class TxGasUtil {
  constructor(provider) {
    this.query = new EthQuery(provider);
  }

  /**
     @param txMeta {Object} - the txMeta object
     @returns {object} the txMeta object with the gas written to the txParams
     */
  async analyzeGasUsage(txMeta) {
    // noinspection JSUnresolvedFunction
    const block = await this.query.getBlockByNumber('latest', false);
    let estimatedGasHex;
    try {
      estimatedGasHex = await this.estimateTxGas(txMeta, block.gasLimit);
    } catch (err) {
      txMeta.simulationFails = {
        reason: err.message,
        errorKey: err.errorKey,
        debug: { blockNumber: block.number, blockGasLimit: block.gasLimit }
      };

      if (err.errorKey === TRANSACTION_NO_CONTRACT_ERROR_KEY) {
        txMeta.simulationFails.debug.getCodeResponse = err.getCodeResponse;
      }

      return txMeta;
    }
    this.setTxGas(txMeta, block.gasLimit, estimatedGasHex);
    return txMeta;
  }

  /**
     Estimates the tx's gas usage
     @param txMeta {Object} - the txMeta object
     @param blockGasLimitHex {string} - hex string of the block's gas limit
     @returns {string} the estimated gas limit as a hex string
     */
  async estimateTxGas(txMeta, blockGasLimitHex) {
    const txParams = txMeta.txParams;

    // check if gasLimit is already specified
    txMeta.gasLimitSpecified = Boolean(txParams.gas);

    // if it is, use that value
    if (txMeta.gasLimitSpecified) {
      return txParams.gas;
    }

    const recipient = txParams.to;
    const hasRecipient = Boolean(recipient);

    // see if we can set the gas based on the recipient
    if (hasRecipient) {
      const code = await this.query.getCode(recipient);
      // For an address with no code, geth will return '0x', and ganache-core v2.2.1 will return '0x0'
      const codeIsEmpty = !code || code === '0x' || code === '0x0';

      if (codeIsEmpty) {
        // if there's data in the params, but there's no contract code, it's not a valid transaction
        if (txParams.data) {
          throw new Error(
            'TxGasUtil - Trying to call a function on a non-contract address'
          );
        }

        // This is a standard ether simple send, gas requirement is exactly 21k
        txParams.gas = SIMPLE_GAS_COST;
        // prevents buffer addition
        txMeta.simpleSend = true;
        return SIMPLE_GAS_COST;
      }
    }

    // fallback to block gasLimit
    const blockGasLimitBN = hexToBn(blockGasLimitHex);
    const saferGasLimitBN = BnMultiplyByFraction(blockGasLimitBN, 19, 20);
    txParams.gas = bnToHex(saferGasLimitBN);

    // estimate tx gas requirements
    return this.query.estimateGas(txParams);
  }

  /**
     Writes the gas on the txParams in the txMeta
     @param txMeta {Object} - the txMeta object to write to
     @param blockGasLimitHex {string} - the block gas limit hex
     @param estimatedGasHex {string} - the estimated gas hex
     */
  setTxGas(txMeta, blockGasLimitHex, estimatedGasHex) {
    txMeta.estimatedGas = addHexPrefix(estimatedGasHex);
    const txParams = txMeta.txParams;

    // if gasLimit was specified and doesnt OOG,
    // use original specified amount
    if (txMeta.gasLimitSpecified || txMeta.simpleSend) {
      txMeta.estimatedGas = txParams.gas;
      return;
    }
    // if gasLimit not originally specified,
    // try adding an additional gas buffer to our estimation for safety
    txParams.gas = this.addGasBuffer(txMeta.estimatedGas, blockGasLimitHex);
    return txParams;
  }

  /**
     Adds a gas buffer with out exceeding the block gas limit

     @param initialGasLimitHex {string} - the initial gas limit to add the buffer too
     @param blockGasLimitHex {string} - the block gas limit
     @returns {string} the buffered gas limit as a hex string
     */
  addGasBuffer(initialGasLimitHex, blockGasLimitHex) {
    const initialGasLimitBn = hexToBn(initialGasLimitHex);
    const blockGasLimitBn = hexToBn(blockGasLimitHex);
    // noinspection JSUnresolvedFunction
    const upperGasLimitBn = blockGasLimitBn.muln(0.9);
    // noinspection JSUnresolvedFunction
    const bufferedGasLimitBn = initialGasLimitBn.muln(1.5);

    // if initialGasLimit is above blockGasLimit, dont modify it
    if (initialGasLimitBn.gt(upperGasLimitBn))
      return bnToHex(initialGasLimitBn);
    // if bufferedGasLimit is below blockGasLimit, use bufferedGasLimit
    if (bufferedGasLimitBn.lt(upperGasLimitBn))
      return bnToHex(bufferedGasLimitBn);
    // otherwise use blockGasLimit
    return bnToHex(upperGasLimitBn);
  }
}

export default TxGasUtil;
