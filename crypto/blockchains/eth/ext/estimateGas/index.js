import EventEmitter from '@metamask/safe-event-emitter';
import ethUtil from 'ethereumjs-util';
import EthQuery from 'ethjs-query';
import TxGasUtil from './tx-gas-utils';
import HttpProvider from 'ethjs-provider-http';

class TransactionController extends EventEmitter {
  constructor(opts) {
    super(opts);
    this.provider = new HttpProvider(opts.provider);
    this.getGasPrice = opts.getGasPrice;

    this.query = new EthQuery(this.provider);
    this.txGasUtil = new TxGasUtil(this.provider);
  }

  /**
     adds the tx gas defaults: gas && gasPrice
     @param txMeta {Object} - the txMeta object
     @returns {Promise<object>} resolves with txMeta
     */
  async addTxGasDefaults(txMeta) {
    const txParams = txMeta.txParams;
    // ensure value
    txParams.value = txParams.value
      ? ethUtil.addHexPrefix(txParams.value)
      : '0x0';
    txMeta.gasPriceSpecified = Boolean(txParams.gasPrice);
    // let gasPrice = txParams.gasPrice
    const gasPrice = this.getGasPrice;
    /* if (!gasPrice) {
          gasPrice = this.getGasPrice ? this.getGasPrice() : await this.query.gasPrice()
        } */
    // noinspection JSCheckFunctionSignatures
    txParams.gasPrice = ethUtil.addHexPrefix(gasPrice.toString(16));
    // set gasLimit
    return this.txGasUtil.analyzeGasUsage(txMeta);
  }
}

export default TransactionController;
