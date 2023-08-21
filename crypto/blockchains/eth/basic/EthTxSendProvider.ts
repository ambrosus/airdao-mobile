/**
 * @author Ksu
 * @version 0.32
 */
import { AirDAOBlockchainTypes } from '../../AirDAOBlockchainTypes';
import AirDAOCryptoLog from '../../../common/AirDAOCryptoLog';
import BlocksoftUtils from '../../../common/AirDAOUtils';
import EthTmpDS from '../stores/EthTmpDS';
import EthRawDS from '../stores/EthRawDS';

export default class EthTxSendProvider {
  private _web3: any;
  private _trezorServerCode: any;
  private _trezorServer: any;
  private _settings: any;
  private _mainCurrencyCode: string;
  private _mainChainId: any;

  constructor(
    web3: any,
    trezorServerCode: any,
    mainCurrencyCode: string,
    mainChainId: any,
    settings: any
  ) {
    this._web3 = web3;
    this._trezorServerCode = trezorServerCode;
    this._trezorServer = 'to_load';
    this._settings = settings;

    this._mainCurrencyCode = mainCurrencyCode;
    this._mainChainId = mainChainId;
  }

  async sign(
    tx: AirDAOBlockchainTypes.EthTx,
    privateData: AirDAOBlockchainTypes.TransferPrivateData,
    txRBF: any,
    logData: any
  ): Promise<{ transactionHash: string; transactionJson: any }> {
    // @ts-ignore
    await AirDAOCryptoLog.log(
      this._settings.currencyCode + ' EthTxSendProvider._innerSign started',
      logData
    );
    // noinspection JSUnresolvedVariable
    if (privateData.privateKey.substr(0, 2) !== '0x') {
      privateData.privateKey = '0x' + privateData.privateKey;
    }
    if (tx.value.toString().substr(0, 1) === '-') {
      throw new Error('SERVER_RESPONSE_NOTHING_LEFT_FOR_FEE');
    }
    // noinspection JSUnresolvedVariable
    if (this._mainChainId) {
      tx.chainId = this._mainChainId;
    }
    let signData = false;
    try {
      signData = await this._web3.eth.accounts.signTransaction(
        tx,
        privateData.privateKey
      );
    } catch (e: any) {
      console.log({ e });
      throw new Error(
        this._settings.currencyCode +
          ' EthTxSendProvider._innerSign signTransaction error ' +
          e.message
      );
    }
    return signData.rawTransaction;
  }

  async send(
    tx: AirDAOBlockchainTypes.EthTx,
    privateData: AirDAOBlockchainTypes.TransferPrivateData,
    txRBF: any,
    logData: any
  ): Promise<{ transactionHash: string; transactionJson: any }> {
    await AirDAOCryptoLog.log(
      this._settings.currencyCode + ' EthTxSendProvider._innerSendTx started',
      logData
    );
    tx.gas = 21000;
    tx.gasPrice = 22000000;
    tx.value = (parseFloat(tx.value) * 10e5).toString();
    console.log({ tx, privateData, txRBF });
    const rawTransaction = await this.sign(tx, privateData, txRBF, logData);
    const sendLink = this._web3.LINK;
    const tmp = await this._web3.eth.sendSignedTransaction(rawTransaction);
    const result = {
      data: {
        result:
          typeof tmp.transactionHash !== 'undefined'
            ? tmp.transactionHash
            : false
      }
    };
    const transactionHash = result.data.result;
    const nonce =
      typeof logData.setNonce !== 'undefined'
        ? logData.setNonce
        : BlocksoftUtils.hexToDecimal(tx.nonce);

    await EthRawDS.saveRaw({
      address: tx.from,
      currencyCode: this._settings.currencyCode,
      transactionUnique: tx.from + '_' + nonce,
      transactionHash,
      transactionRaw: rawTransaction,
      transactionLog: logData
    });

    AirDAOCryptoLog.log(
      this._settings.currencyCode +
        ' EthTxSendProvider.send save nonce ' +
        nonce +
        ' from ' +
        tx.from +
        ' ' +
        transactionHash
    );
    await EthTmpDS.saveNonce(
      this._mainCurrencyCode,
      tx.from,
      'send_' + transactionHash,
      nonce
    );
    const transactionJson = {
      nonce,
      gasPrice:
        typeof logData.gasPrice !== 'undefined'
          ? logData.gasPrice
          : BlocksoftUtils.hexToDecimal(tx.gasPrice)
    };
    return { transactionHash, transactionJson };
  }
}
