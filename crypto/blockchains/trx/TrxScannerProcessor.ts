/**
 * @version 0.5
 * https://github.com/tronscan/tronscan-frontend/wiki/TRONSCAN-API
 */
import TronUtils from './ext/TronUtils';
import TrxTronscanProvider from './basic/TrxTronscanProvider';
import TrxTrongridProvider from './basic/TrxTrongridProvider';
import TrxTransactionsProvider from './basic/TrxTransactionsProvider';
import TrxTransactionsTrc20Provider from './basic/TrxTransactionsTrc20Provider';
import AirDAOCryptoLog from '../../common/AirDAOCryptoLog';
import Database from '@app/appstores/DataSource/Database/main';
import BlocksoftAxios from '@crypto/common/BlocksoftAxios';
import BlocksoftUtils from '@crypto/common/AirDAOUtils';
import transactionDS from '@app/appstores/DataSource/Transaction/Transaction';
import BlocksoftExternalSettings from '@crypto/common/AirDAOExternalSettings';
import TronStakeUtils from '@crypto/blockchains/trx/ext/TronStakeUtils';
import config from '@constants/config';

let CACHE_PENDING_TXS = false;

interface TronScannerSettings {
  tokenName?: string;
  currencyCode: string;
}

interface TronBalanceResult {
  balance: string;
  frozen: string;
  frozenEnergy: string;
  balanceStaked: string;
  unconfirmed: number;
  provider: string;
}

export default class TrxScannerProcessor {
  private _settings: TronScannerSettings;
  private _tokenName: string;
  private _tronscanProvider: TrxTronscanProvider;
  private _trongridProvider: TrxTrongridProvider;
  private _transactionsProvider: TrxTransactionsProvider;
  private _transactionsTrc20Provider: TrxTransactionsTrc20Provider;

  constructor(settings: TronScannerSettings) {
    this._settings = settings;
    this._tokenName = '_';
    if (typeof settings.tokenName !== 'undefined') {
      this._tokenName = settings.tokenName;
    }
    this._tronscanProvider = new TrxTronscanProvider();
    this._trongridProvider = new TrxTrongridProvider();
    this._transactionsProvider = new TrxTransactionsProvider();
    this._transactionsTrc20Provider = new TrxTransactionsTrc20Provider();
  }

  async isMultisigBlockchain(address: string): Promise<boolean> {
    address = address.trim();
    let addressHex = address;
    if (address.substr(0, 1) === 'T') {
      addressHex = await TronUtils.addressToHex(address);
    }
    return this._trongridProvider.isMultisigTrongrid(addressHex);
  }

  async getBalanceBlockchain(
    address: string,
    jsonData: any,
    walletHash: string,
    source: string
  ): Promise<TronBalanceResult> {
    address = address.trim();
    AirDAOCryptoLog.log(
      this._tokenName +
        ' TrxScannerProcessor getBalanceBlockchain address ' +
        address +
        ' from ' +
        source
    );
    let addressHex = address;
    if (address.substr(0, 1) === 'T') {
      addressHex = TronUtils.addressToHex(address);
    } else {
      address = TronUtils.addressHexToStr(addressHex);
    }
    const useTronscan =
      BlocksoftExternalSettings.getStatic('TRX_USE_TRONSCAN') * 1 > 0;
    let result: TronBalanceResult | boolean = false;
    let subresult: boolean | TronBalanceResult = false;
    if (useTronscan) {
      result = await this._tronscanProvider.get(
        address,
        this._tokenName,
        source === 'AccountScreen'
      );
      AirDAOCryptoLog.log(
        this._tokenName +
          ' TrxScannerProcessor getBalanceBlockchain address ' +
          address +
          ' result tronScan ' +
          JSON.stringify(result) +
          ' from ' +
          source
      );
    }

    if (!result) {
      if (this._tokenName !== '_' && this._tokenName.substr(0, 1) === 'T') {
        // https://developers.tron.network/docs/trc20-contract-interaction#balanceof
        try {
          const sendLink = BlocksoftExternalSettings.getStatic('TRX_SEND_LINK');
          const params = {
            contract_address: TronUtils.addressToHex(this._tokenName),
            function_selector: 'balanceOf(address)',
            parameter: '0000000000000000000000' + addressHex,
            owner_address: addressHex
          };
          const tmp = await BlocksoftAxios.post(
            sendLink + '/wallet/triggerconstantcontract',
            params
          );
          if (
            typeof tmp.data !== 'undefined' &&
            typeof tmp.data.constant_result !== 'undefined'
          ) {
            await AirDAOCryptoLog.log(
              this._tokenName +
                ' TrxScannerProcessor getBalanceBlockchain address ' +
                address +
                ' result tronwallet ' +
                JSON.stringify(tmp.data) +
                ' from ' +
                source
            );
            return {
              // TODO
              balanceStaked: '',
              frozen: '',
              frozenEnergy: '',
              balance: BlocksoftUtils.hexToDecimal(
                '0x' + tmp.data.constant_result
              ),
              unconfirmed: 0,
              provider: 'tronwallet-raw-call'
            };
          }
        } catch (e: any) {
          AirDAOCryptoLog.log(
            this._tokenName +
              ' TrxScannerProcessor getBalanceBlockchain address ' +
              address +
              ' error tronwallet ' +
              e.message
          );
        }
        result = await this._tronscanProvider.get(address, this._tokenName);
      } else {
        result = await this._trongridProvider.get(
          addressHex,
          this._tokenName,
          source === 'AccountScreen'
        );
      }
      AirDAOCryptoLog.log(
        this._tokenName +
          ' TrxScannerProcessor getBalanceBlockchain address ' +
          address +
          ' result tronGrid ' +
          JSON.stringify(result) +
          ' from ' +
          source
      );
    }

    if (!result && this._tokenName !== '_') {
      subresult = await this._tronscanProvider.get(
        address,
        '_',
        source === 'AccountScreen'
      );
      AirDAOCryptoLog.log(
        this._tokenName +
          ' TrxScannerProcessor getBalanceBlockchain address ' +
          address +
          ' result tronScan2 ' +
          JSON.stringify(result) +
          ' from ' +
          source
      );

      if (subresult) {
        AirDAOCryptoLog.log(
          this._tokenName +
            ' TrxScannerProcessor getBalanceBlockchain address ' +
            address +
            ' subresult tronScan ' +
            JSON.stringify(subresult) +
            ' from ' +
            source
        );
        return {
          frozen: '',
          frozenEnergy: '',
          balance: '0',
          unconfirmed: 0,
          balanceStaked: '0',
          balanceAvailable: '0',
          provider: 'tronscan-ok-but-no-token'
        };
      }
    }

    (result as TronBalanceResult).balanceStaked =
      typeof result.frozen !== 'undefined'
        ? (result.frozen as any) * 1 + (result.frozenEnergy as any) * 1
        : '0';
    (result as TronBalanceResult).balanceAvailable = (result as any).balance;
    if ((result as any).balanceStaked * 1 > 0) {
      (result as any).balance =
        (result as any).balance * 1 + (result as any).balanceStaked * 1;
    }
    return result as TronBalanceResult;
  }

  async getResourcesBlockchain(address: string): Promise<any> {
    address = address.trim();
    AirDAOCryptoLog.log(
      this._tokenName +
        ' TrxScannerProcessor getResourcesBlockchain address ' +
        address
    );
    let addressHex = address;
    if (address.substr(0, 1) === 'T') {
      addressHex = await TronUtils.addressToHex(address);
    }
    const result = await this._trongridProvider.getResources(
      addressHex,
      this._tokenName
    );
    return result;
  }

  async getTransactionsBlockchain(
    scanData: { account: { address: string } },
    source: string
  ): Promise<any[]> {
    let result;
    let lastBlock = false;
    if (this._tokenName[0] === 'T') {
      this._transactionsTrc20Provider.setLink(this._tokenName);
      result = await this._transactionsTrc20Provider.get(
        scanData,
        this._tokenName
      );
      lastBlock = this._transactionsTrc20Provider._lastBlock;
    } else {
      result = await this._transactionsProvider.get(scanData, this._tokenName);
      lastBlock = this._transactionsProvider._lastBlock;
    }
    await this.getTransactionsPendingBlockchain(scanData, source, lastBlock);
    return result;
  }

  async resetTransactionsPendingBlockchain(
    scanData: any,
    source: string,
    lastBlock = false
  ): Promise<boolean> {
    CACHE_PENDING_TXS = scanData.resetTime || 0;
    if (
      typeof scanData.specialActionNeeded !== 'undefined' &&
      scanData.specialActionNeeded &&
      typeof scanData.account.address !== 'undefined'
    ) {
      await Database.query(`
                    UPDATE transactions SET special_action_needed=''
                    WHERE special_action_needed='${scanData.specialActionNeeded}'
                    AND address_from_basic='${scanData.account.address}'
                    `);
    }
    return false;
  }

  async getTransactionsPendingBlockchain(
    scanData: any,
    source: string,
    lastBlock = false
  ): Promise<boolean> {
    if (
      CACHE_PENDING_TXS > 0 &&
      CACHE_PENDING_TXS - new Date().getTime() < 60000
    ) {
      return false;
    }
    // id, transaction_hash, block_number, block_confirmations, transaction_status,
    const sql = `SELECT t.id,
            t.wallet_hash AS walletHash,
            t.transaction_hash AS transactionHash,
            t.transactions_scan_log AS transactionsScanLog,
            t.address_from_basic AS addressFromBasic,
            t.special_action_needed AS specialActionNeeded,
            a.derivation_path AS derivationPath
            FROM transactions AS t
            LEFT JOIN account AS a ON a.address = t.address_from_basic
            WHERE
            (t.currency_code='${this._settings.currencyCode}' OR t.currency_code LIKE 'TRX%')
            AND t.transaction_of_trustee_wallet=1
            AND (t.block_number IS NULL OR t.block_number<20 OR t.special_action_needed='vote' OR t.special_action_needed='vote_after_unfreeze')

            ORDER BY created_at DESC
            LIMIT 10
        `;
    const res = await Database.query(sql);
    if (
      !res ||
      typeof res.array === 'undefined' ||
      !res.array ||
      res.array.length === 0
    ) {
      CACHE_PENDING_TXS = new Date().getTime();
      return false;
    }

    const sendLink = BlocksoftExternalSettings.getStatic('TRX_SEND_LINK');
    let needUpdateBalance = -1;
    if (!lastBlock) {
      needUpdateBalance = 0;
      try {
        const link2 = sendLink + '/wallet/getnowblock';
        const block = await BlocksoftAxios.get(link2);
        if (
          typeof block !== 'undefined' &&
          block &&
          typeof block.data !== 'undefined'
        ) {
          lastBlock = block.data.block_header.raw_data.number;
        }
      } catch (e1) {
        if (config.debug.cryptoErrors) {
          console.log(
            this._settings.currencyCode +
              ' TrxScannerProcessor.getTransactionsPendingBlockchain lastBlock',
            e1
          );
        }
      }
    }

    const unique: { [key: string]: any } = {};
    for (const row of res.array) {
      const linkRecheck = sendLink + '/wallet/gettransactioninfobyid';
      try {
        const recheck = await BlocksoftAxios.post(linkRecheck, {
          value: row.transactionHash
        });
        if (typeof recheck.data !== undefined) {
          const isSuccess = await this._unifyFromReceipt(
            recheck.data,
            row,
            lastBlock
          );
          if (isSuccess && needUpdateBalance === 0) {
            needUpdateBalance = 1;
          }
          if (isSuccess && row.specialActionNeeded && row.addressFromBasic) {
            row.confirmations = lastBlock - recheck.data.blockNumber;
            if (typeof unique[row.addressFromBasic] === undefined) {
              unique[row.addressFromBasic] = row;
            } else {
              if (
                unique[row.addressFromBasic].confirmations > row.confirmations
              ) {
                unique[row.addressFromBasic].confirmations = row.confirmations;
              }
              if (
                unique[row.addressFromBasic].specialActionNeeded ===
                'vote_after_unfreeze'
              ) {
                unique[row.addressFromBasic].specialActionNeeded =
                  row.specialActionNeeded;
              }
            }
          }
        }
      } catch (e1) {
        if (config.debug.cryptoErrors) {
          console.log(
            this._settings.currencyCode +
              ' TrxScannerProcessor.getTransactionsPendingBlockchain recheck',
            e1
          );
        }
      }
    }

    if (unique) {
      for (const address in unique) {
        const {
          walletHash,
          derivationPath,
          confirmations,
          specialActionNeeded
        } = unique[address];
        if (confirmations < 20) {
          AirDAOCryptoLog.log(
            this._settings.currencyCode +
              ' TrxScannerProcessor.getTransactionsPendingBlockchain vote all skipped by ' +
              confirmations +
              ' for ' +
              address
          );
          continue;
        }

        AirDAOCryptoLog.log(
          this._settings.currencyCode +
            ' TrxScannerProcessor.getTransactionsPendingBlockchain vote all inited for ' +
            address +
            ' action ' +
            specialActionNeeded
        );
        try {
          if (
            await TronStakeUtils.sendVoteAll(
              address,
              derivationPath,
              walletHash,
              specialActionNeeded
            )
          ) {
            await Database.query(`
                    UPDATE transactions SET special_action_needed='' WHERE special_action_needed='vote' OR special_action_needed='vote_after_unfreeze'
                    AND address_from_basic='${address}'
                    `);
            AirDAOCryptoLog.log(
              this._settings.currencyCode +
                ' TrxScannerProcessor.getTransactionsPendingBlockchain vote all finished for ' +
                address
            );
          }
        } catch (e: any) {
          if (config.debug.cryptoErrors) {
            console.log(
              this._settings.currencyCode +
                ' TrxScannerProcessor.getTransactionsPendingBlockchain vote all error for ' +
                address +
                ' ' +
                e.message
            );
          }
          AirDAOCryptoLog.log(
            this._settings.currencyCode +
              ' TrxScannerProcessor.getTransactionsPendingBlockchain vote all error for ' +
              address +
              ' ' +
              e.message
          );
        }
      }
    }

    return needUpdateBalance > 0;
  }

  async _unifyFromReceipt(
    transaction: any,
    row: any,
    lastBlock: number
  ): Promise<boolean> {
    /**
     * {"id":"fb7580e4bb6161e0812beb05cf4a1b6463ba55e33def5dd7f3f5c1561c91a49e","blockNumber":29134019,"blockTimeStamp":1617823467000,
     * "receipt":{'origin_energy_usage":4783,"energy_usage_total":4783,"net_usage":345,"result":"OUT_OF_ENERGY'},
     * "result":"FAILED"
     */
    if (
      typeof transaction.blockNumber === 'undefined' ||
      transaction.blockNumber * 1 <= 1
    )
      return false;

    let transactionStatus = 'success';
    if (
      typeof transaction.result !== undefined &&
      transaction.result === 'FAILED'
    ) {
      transactionStatus = 'fail';
      if (
        typeof transaction.receipt !== undefined &&
        typeof transaction.receipt.result !== undefined
      ) {
        if (transaction.receipt.result === 'OUT_OF_ENERGY') {
          transactionStatus = 'out_of_energy';
        }
      }
    }
    let formattedTime;
    try {
      formattedTime = BlocksoftUtils.toDate(transaction.blockTimeStamp / 1000);
    } catch (e) {
      e.message +=
        ' timestamp error transaction2 data ' + JSON.stringify(transaction);
      throw e;
    }

    await transactionDS.saveTransaction(
      {
        blockNumber: transaction.blockNumber,
        blockTime: formattedTime,
        blockConfirmations: lastBlock - transaction.blockNumber,
        transactionStatus,
        transactionsScanLog:
          new Date().toISOString() +
          ' RECEIPT RECHECK ' +
          JSON.stringify(transaction) +
          ' ' +
          row.transactionsScanLog
      },
      row.id,
      'receipt'
    );
    return transactionStatus === 'success';
  }
}
