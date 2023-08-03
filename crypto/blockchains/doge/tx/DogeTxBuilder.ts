/**
 * @version 0.20
 */
import { AirDAOBlockchainTypes } from '../../AirDAOBlockchainTypes';
import BlocksoftCryptoLog from '../../../common/BlocksoftCryptoLog';
import { TransactionBuilder, ECPair, payments } from 'bitcoinjs-lib';
import BlocksoftExternalSettings from '../../../common/AirDAOExternalSettings';

import networksConstants from '../../../common/ext/networks-constants';

const MAX_SEQ = 4294967294; // 0xfffffffe // no replace by fee
const MIN_SEQ = 4294960000; // for RBF

export default class DogeTxBuilder implements AirDAOBlockchainTypes.TxBuilder {
  protected _settings: AirDAOBlockchainTypes.CurrencySettings;
  private _builderSettings: AirDAOBlockchainTypes.BuilderSettings;
  protected _bitcoinNetwork: any;
  private _feeMaxForByteSatoshi: number | any;

  protected keyPair: any;

  constructor(
    settings: AirDAOBlockchainTypes.CurrencySettings,
    builderSettings: AirDAOBlockchainTypes.BuilderSettings
  ) {
    this._settings = settings;
    this._builderSettings = builderSettings;
    this._bitcoinNetwork = networksConstants[settings.network].network;
  }

  async _reInit() {
    const fromExt = await BlocksoftExternalSettings.get(
      this._settings.currencyCode + '_MAX_FOR_BYTE_TX_BUILDER',
      'DogeTxBuilder._reInit'
    );
    this._feeMaxForByteSatoshi =
      fromExt && fromExt * 1 > 0
        ? fromExt * 1
        : this._builderSettings.feeMaxForByteSatoshi;
    await BlocksoftCryptoLog.log(
      'DogeTxBuilder.getRawTx ' +
        this._settings.currencyCode +
        ' _feeMaxForByteSatoshi ' +
        this._feeMaxForByteSatoshi +
        ' fromExt ' +
        fromExt
    );
  }

  _getRawTxValidateKeyPair(
    privateData: AirDAOBlockchainTypes.TransferPrivateData,
    data: AirDAOBlockchainTypes.TransferData
  ): void {
    if (typeof privateData.privateKey === 'undefined') {
      throw new Error('DogeTxBuilder.getRawTx requires privateKey');
    }
    try {
      this.keyPair = ECPair.fromWIF(
        privateData.privateKey,
        this._bitcoinNetwork
      );
      const address = payments.p2pkh({
        pubkey: this.keyPair.publicKey,
        network: this._bitcoinNetwork
      }).address;
      if (address !== data.addressFrom) {
        // noinspection ExceptionCaughtLocallyJS
        throw new Error(
          'not valid signing address ' + data.addressFrom + ' != ' + address
        );
      }
    } catch (e) {
      e.message +=
        ' in privateKey ' +
        this._settings.currencyCode +
        ' DogeTxBuilder signature check ';
      throw e;
    }
  }

  async _getRawTxAddInput(
    txb: TransactionBuilder,
    i: number,
    input: AirDAOBlockchainTypes.UnspentTx,
    nSequence: number
  ): Promise<void> {
    if (typeof input.vout === 'undefined') {
      throw new Error('no input.vout');
    }
    if (typeof nSequence === 'undefined') {
      throw new Error('no nSequence');
    }
    txb.addInput(input.txid, input.vout, nSequence);
  }

  async _getRawTxSign(
    txb: TransactionBuilder,
    i: number,
    input: AirDAOBlockchainTypes.UnspentTx
  ): Promise<void> {
    await BlocksoftCryptoLog.log('DogeTxBuilder.getRawTx sign', input);
    // @ts-ignore
    txb.sign(i, this.keyPair, null, null, input.value * 1);
  }

  _getRawTxAddOutput(
    txb: TransactionBuilder,
    output: AirDAOBlockchainTypes.OutputTx
  ): void {
    // @ts-ignore
    const amount = Math.round(output.amount * 1);
    if (amount === 0) {
      // do nothing or txb.addOutput(output.to, 546)
    } else {
      txb.addOutput(output.to, amount);
    }
  }

  async getRawTx(
    data: AirDAOBlockchainTypes.TransferData,
    privateData: AirDAOBlockchainTypes.TransferPrivateData,
    preparedInputsOutputs: AirDAOBlockchainTypes.PreparedInputsOutputsTx
  ): Promise<{
    rawTxHex: string;
    nSequence: number;
    txAllowReplaceByFee: boolean;
    preparedInputsOutputs: AirDAOBlockchainTypes.PreparedInputsOutputsTx;
  }> {
    await this._reInit();

    this._getRawTxValidateKeyPair(privateData, data);
    await BlocksoftCryptoLog.log(
      this._settings.currencyCode +
        ' DogeTxBuilder.getRawTx validated address private key'
    );

    let nSequence = 0;
    let txAllowReplaceByFee = false;
    if (
      typeof data.transactionJson === 'undefined' ||
      !data.transactionJson ||
      typeof data.transactionJson.nSequence === 'undefined'
    ) {
      if (data.allowReplaceByFee) {
        nSequence = MIN_SEQ;
        txAllowReplaceByFee = true;
        await BlocksoftCryptoLog.log(
          this._settings.currencyCode +
            ' DogeTxBuilder.getRawTx allow RBF ' +
            nSequence
        );
      } else {
        nSequence = MAX_SEQ;
        txAllowReplaceByFee = false;
        await BlocksoftCryptoLog.log(
          this._settings.currencyCode +
            ' DogeTxBuilder.getRawTx no RBF ' +
            nSequence
        );
      }
    } else {
      nSequence = data.transactionJson.nSequence * 1 + 1;
      txAllowReplaceByFee = true;

      if (nSequence >= MAX_SEQ) {
        nSequence = MAX_SEQ;
        txAllowReplaceByFee = false;
        await BlocksoftCryptoLog.log(
          this._settings.currencyCode +
            ' DogeTxBuilder.getRawTx no RBF by old nSeq ' +
            data.transactionJson.nSequence +
            ' +1 => ' +
            nSequence
        );
      } else {
        await BlocksoftCryptoLog.log(
          this._settings.currencyCode +
            ' DogeTxBuilder.getRawTx allow RBF by old nSeq ' +
            data.transactionJson.nSequence +
            ' +1 => ' +
            nSequence
        );
      }
    }

    const txb = new TransactionBuilder(
      this._bitcoinNetwork,
      this._feeMaxForByteSatoshi
    );
    await BlocksoftCryptoLog.log(
      this._settings.currencyCode +
        ' DogeTxBuilder.getRawTx started max4Bytes ' +
        this._feeMaxForByteSatoshi
    );

    txb.setVersion(1);

    const log = { inputs: [], outputs: [] };
    for (let i = 0, ic = preparedInputsOutputs.inputs.length; i < ic; i++) {
      const input = preparedInputsOutputs.inputs[i];
      try {
        await this._getRawTxAddInput(txb, i, input, nSequence);
        // @ts-ignore
        log.inputs.push({ txid: input.txid, vout: input.vout, nSequence });
        // @ts-ignore
        await BlocksoftCryptoLog.log(
          this._settings.currencyCode + ' DogeTxBuilder.getRawTx input added',
          input
        );
      } catch (e) {
        await BlocksoftCryptoLog.log(
          this._settings.currencyCode +
            ' DogeTxBuilder.getRawTx input add error ',
          input
        );
        throw e;
      }
    }

    let output;
    for (output of preparedInputsOutputs.outputs) {
      try {
        if (output.amount !== 'removed') {
          this._getRawTxAddOutput(txb, output);
        }
        // @ts-ignore
        log.outputs.push({ addressTo: output.to, amount: output.amount });
        // @ts-ignore
        await BlocksoftCryptoLog.log(
          this._settings.currencyCode + ' DogeTxBuilder.getRawTx output added ',
          output
        );
      } catch (e) {
        await BlocksoftCryptoLog.log(
          this._settings.currencyCode +
            ' DogeTxBuilder.getRawTx output add error ',
          output
        );
        throw e;
      }
    }

    for (let i = 0, ic = preparedInputsOutputs.inputs.length; i < ic; i++) {
      const input = preparedInputsOutputs.inputs[i];
      try {
        await BlocksoftCryptoLog.log(
          this._settings.currencyCode + ' DogeTxBuilder.getRawTx sign adding'
        );
        await this._getRawTxSign(txb, i, input);
        await BlocksoftCryptoLog.log(
          this._settings.currencyCode + ' DogeTxBuilder.getRawTx sign added'
        );
      } catch (e) {
        await BlocksoftCryptoLog.log(
          this._settings.currencyCode +
            ' DogeTxBuilder.getRawTx input sign error ',
          input
        );
        e.message =
          ' transaction ' +
          this._settings.currencyCode +
          ' DogeTxBuilder sign error: ' +
          e.message;
        throw e;
      }
    }
    let rawTxHex;
    try {
      rawTxHex = txb.build().toHex();
      await BlocksoftCryptoLog.log(
        this._settings.currencyCode +
          ' DogeTxBuilder.getRawTx size ' +
          rawTxHex.length
      );
      // @ts-ignore
      await BlocksoftCryptoLog.log(
        this._settings.currencyCode + ' DogeTxBuilder.getRawTx hex',
        rawTxHex
      );
    } catch (e) {
      e.message =
        ' transaction ' +
        this._settings.currencyCode +
        ' DogeTxBuilder build error: ' +
        e.message;
      throw e;
    }

    return { rawTxHex, nSequence, txAllowReplaceByFee, preparedInputsOutputs };
  }
}
