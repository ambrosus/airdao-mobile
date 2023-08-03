import BlocksoftCryptoLog from '@crypto/common/BlocksoftCryptoLog';
import XrpTmpDS from './stores/XrpTmpDS';
import BlocksoftExternalSettings from '@crypto/common/BlocksoftExternalSettings';
import XrpDataRippleProvider from '@crypto/blockchains/xrp/basic/XrpDataRippleProvider';
import XrpDataScanProvider from '@crypto/blockchains/xrp/basic/XrpDataScanProvider';

interface UnifiedTransaction {
  // TODO
}

interface BalanceResult {
  balance: number;
  unconfirmed: number;
  provider: string;
}

let CACHE_BLOCK_DATA: any = {};

export default class XrpScannerProcessor {
  private _inited = false;
  private provider!: XrpDataRippleProvider | XrpDataScanProvider;

  async init(): Promise<boolean> {
    if (this._inited) {
      return false;
    }
    CACHE_BLOCK_DATA = await XrpTmpDS.getCache();
    const serverType = BlocksoftExternalSettings.getStatic('XRP_SCANNER_TYPE');
    if (serverType === 'dataripple') {
      this.provider = new XrpDataRippleProvider();
    } else {
      this.provider = new XrpDataScanProvider();
    }
    this.provider.setCache(CACHE_BLOCK_DATA);
    this._inited = true;
    return true;
  }

  async getBalanceBlockchain(address: string): Promise<BalanceResult | false> {
    await this.init();

    let res: any = false;
    let balance = 0;
    let provider = 'none';
    try {
      res = await this.provider.getBalanceBlockchain(address);
      if (res && typeof res.balance !== 'undefined') {
        balance = res.balance;
        provider = res.provider;
      }
    } catch (e: any) {
      if (
        e.message.indexOf('timed out') === -1 &&
        e.message.indexOf('account not found') === -1
      ) {
        throw e;
      } else {
        return false;
      }
    }
    return { balance, unconfirmed: 0, provider };
  }

  async getTransactionsBlockchain(scanData: {
    account: {
      address: string;
      walletHash: string;
    };
    additional: any;
  }): Promise<UnifiedTransaction[] | false> {
    await this.init();
    const address = scanData.account.address.trim();
    await BlocksoftCryptoLog.log(
      'XrpScannerProcessor.getTransactions started ' + address
    );

    let transactions: UnifiedTransaction[] | false = [];
    try {
      transactions = await this.provider.getTransactionsBlockchain(scanData);
    } catch (e: any) {
      if (
        e.message.indexOf('account not found') === -1 &&
        e.message.indexOf('to retrieve payments') === -1 &&
        e.message.indexOf('limit exceeded') === -1 &&
        e.message.indexOf('timed out') === -1
      ) {
        throw e;
      } else {
        return false;
      }
    }

    await BlocksoftCryptoLog.log(
      'XrpScannerProcessor.getTransactions finished ' + address
    );
    return transactions;
  }
}
