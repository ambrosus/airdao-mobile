/**
 * @version 0.5
 */
import BlocksoftCryptoLog from '../../common/BlocksoftCryptoLog';
import BlocksoftAxios from '@crypto/common/BlocksoftAxios';
import BlocksoftExternalSettings from '@crypto/common/AirDAOExternalSettings';
import TransactionFilterTypeDict from '@appV2/dicts/transactionFilterTypeDict';
import WavesTransactionsProvider from '@crypto/blockchains/waves/providers/WavesTransactionsProvider';

export default class WavesScannerProcessor {
  private _settings: any;
  private _provider: WavesTransactionsProvider;
  private _mainCurrencyCode: string;
  private _apiPath: string | undefined;

  constructor(settings: any) {
    this._settings = settings;
    this._provider = new WavesTransactionsProvider();
    this._mainCurrencyCode = 'WAVES';
    if (
      this._settings.currencyCode === 'ASH' ||
      this._settings.currencyCode.indexOf('ASH_') === 0
    ) {
      this._mainCurrencyCode = 'ASH';
    }
  }

  /**
   * https://nodes.wavesnodes.com/addresses/balance/details/3P274YB5qseSE9DTTL3bpSjosZrYBPDpJ8k
   * https://nodes.wavesnodes.com/api-docs/index.html#/addresses/getWavesBalances
   * https://docs.waves.tech/en/blockchain/account/account-balance#account-balance-in-waves
   * @return {Promise<{balance, provider}>}
   */
  async getBalanceBlockchain(address: string): Promise<any> {
    if (this._mainCurrencyCode === 'ASH') {
      this._apiPath = await BlocksoftExternalSettings.get('ASH_SERVER');
    } else {
      this._apiPath = await BlocksoftExternalSettings.get('WAVES_SERVER');
    }
    address = address.trim();
    BlocksoftCryptoLog.log(
      `${this._settings.currencyCode} WavesScannerProcessor getBalanceBlockchain address ${address}`
    );

    const link = `${this._apiPath}/addresses/balance/details/${address}`;
    const res = await BlocksoftAxios.get(link);
    if (!res) {
      return false;
    }
    try {
      return {
        balance: res.data.available,
        unconfirmed: 0,
        provider: 'wavesnodes.com'
      };
    } catch (e: any) {
      BlocksoftCryptoLog.log(
        `${
          this._settings.currencyCode
        } WavesProcessor getBalanceBlockchain address ${address} balance ${JSON.stringify(
          res
        )} to hex error ${e.message}`
      );
    }
    return false;
  }

  /**
   * https://nodes.wavesnodes.com/transactions/address/3P274YB5qseSE9DTTL3bpSjosZrYBPDpJ8k/limit/100
   * @param  {string} scanData.account.address
   * @return {Promise<[UnifiedTransaction]>}
   */
  async getTransactionsBlockchain(scanData: any, source: any): Promise<any[]> {
    const address = scanData.account.address.trim();
    const data = await this._provider.get(address, this._mainCurrencyCode);
    const transactions: any[] = [];
    for (const tx of data) {
      const transaction = await this._unifyTransaction(address, tx);
      if (transaction) {
        transactions.push(transaction);
      }
    }
    return transactions;
  }

  /**
   * @param address
   * @param transaction.amount 100000000
   * @param transaction.applicationStatus succeeded
   * @param transaction.assetId null
   * @param transaction.attachment
   * @param transaction.fee 100000
   * @param transaction.feeAsset
   * @param transaction.feeAssetId
   * @param transaction.height 2715839
   * @param transaction.id GxnhfderDpMwdrSfWbTN53NGB1Q2NRQXcGvYdXbzQBXo
   * @param transaction.recipient 3PQQUuGM1Fo8zz72i62dNYkB5kRxqmJkoSu
   * @param transaction.sender 3PLPGmXoDNKeWxSgJRU5vDNogbPj7hJiWQx
   * @param transaction.senderPublicKey GP9hPWAiGDfNYyCTNw6ZWoLCzUqWiYj7MybtPcu8mpkg
   * @param transaction.signature 4FewzMCYLvfQridUZtSFrDXRbDvmawUWtBxWdiEE5CeruG1qfbKbfTkudGyW6Eqs3kW4hTpABQxrhBSBuKV7```typescript
   * /**
   * @param address
   * @param transaction.amount 100000000
   * @param transaction.applicationStatus succeeded
   * @param transaction.assetId null
   * @param transaction.attachment
   * @param transaction.fee 100000
   * @param transaction.feeAsset
   * @param transaction.feeAssetId
   * @param transaction.height 2715839
   * @param transaction.id GxnhfderDpMwdrSfWbTN53NGB1Q2NRQXcGvYdXbzQBXo
   * @param transaction.recipient 3PQQUuGM1Fo8zz72i62dNYkB5kRxqmJkoSu
   * @param transaction.sender 3PLPGmXoDNKeWxSgJRU5vDNogbPj7hJiWQx
   * @param transaction.senderPublicKey GP9hPWAiGDfNYyCTNw6ZWoLCzUqWiYj7MybtPcu8mpkg
   * @param transaction.signature 4FewzMCYLvfQridUZtSFrDXRbDvmawUWtBxWdiEE5CeruG1qfbKbfTkudGyW6Eqs3kW4hTpABQxrhBSBuKV7
   */
  private async _unifyTransaction(
    address: string,
    transaction: any
  ): Promise<any> {
    const unifiedTransaction: any = {};

    unifiedTransaction.hash = transaction.id;
    unifiedTransaction.blockHash = null;
    unifiedTransaction.blockNumber = transaction.height;
    unifiedTransaction.confirmations = await this._provider.getConfirmations(
      transaction.height
    );
    unifiedTransaction.timestamp = transaction.timestamp;
    unifiedTransaction.from = transaction.sender;
    unifiedTransaction.to = transaction.recipient;
    unifiedTransaction.value = transaction.amount;
    unifiedTransaction.fee = transaction.fee;
    unifiedTransaction.data = {
      applicationStatus: transaction.applicationStatus,
      assetId: transaction.assetId,
      attachment: transaction.attachment,
      feeAsset: transaction.feeAsset,
      feeAssetId: transaction.feeAssetId,
      senderPublicKey: transaction.senderPublicKey,
      signature: transaction.signature
    };
    unifiedTransaction.status = TransactionFilterTypeDict.CRYPTO_STATUS_PENDING; // pending

    return unifiedTransaction;
  }
}
