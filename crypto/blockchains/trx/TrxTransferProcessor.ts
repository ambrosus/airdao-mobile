/**
 * @version 0.20
 */
import AirDAOAxios from '../../common/AirDAOAxios';
import AirDAOCryptoLog from '../../common/AirDAOCryptoLog';
import BlocksoftUtils from '../../common/AirDAOUtils';

import TronUtils from './ext/TronUtils';
import TrxTronscanProvider from './basic/TrxTronscanProvider';
import TrxTrongridProvider from './basic/TrxTrongridProvider';
import TrxSendProvider from '@crypto/blockchains/trx/providers/TrxSendProvider';

import { strings, sublocale } from '@app/services/i18n';

import settingsActions from '@app/appstores/Stores/Settings/SettingsActions';
import MarketingEvent from '@app/services/Marketing/MarketingEvent';
import BlocksoftTransactions from '@crypto/actions/BlocksoftTransactions/BlocksoftTransactions';
import BlocksoftExternalSettings from '@crypto/common/AirDAOExternalSettings';
import BlocksoftBalances from '@crypto/actions/BlocksoftBalances/BlocksoftBalances';
import BlocksoftDispatcher from '@lib/BlocksoftDispatcher';
import config from '@constants/config';
import { AirDAOBlockchainTypes } from '@crypto/blockchains/AirDAOBlockchainTypes';

// https://developers.tron.network/docs/parameter-and-return-value-encoding-and-decoding
const ethers = require('ethers');
const ADDRESS_PREFIX_REGEX = /^(41)/;
const AbiCoder = ethers.utils.AbiCoder;
const PROXY_FEE = 'https://proxy.trustee.deals/trx/countFee';

export default class TrxTransferProcessor
  implements AirDAOBlockchainTypes.TransferProcessor
{
  private _settings: any;
  private _tronscanProvider: TrxTronscanProvider;
  private _trongridProvider: TrxTrongridProvider;
  private _tokenName: string;
  private _isToken20: boolean;
  private sendProvider: TrxSendProvider;

  constructor(settings: any) {
    this._settings = settings;
    this._tronscanProvider = new TrxTronscanProvider();
    this._trongridProvider = new TrxTrongridProvider();
    this._tokenName = '_';
    this._isToken20 = false;
    if (typeof settings.tokenName !== 'undefined') {
      this._tokenName = settings.tokenName;
      if (this._tokenName[0] === 'T') {
        this._isToken20 = true;
      }
    }
    this.sendProvider = new TrxSendProvider(this._settings, 'TRX');
  }

  needPrivateForFee(): boolean {
    return false;
  }

  checkSendAllModal(data: { currencyCode: any }): boolean {
    return false;
  }

  async checkTransferHasError(
    data: AirDAOBlockchainTypes.CheckTransferHasErrorData
  ): Promise<AirDAOBlockchainTypes.CheckTransferHasErrorResult> {
    if (!this._isToken20 || (data.amount && data.amount * 1 > 0)) {
      return { isOk: true };
    }
    /**
     * @type {TrxScannerProcessor}
     */
    const balanceProvider = BlocksoftDispatcher.getScannerProcessor(
      this._settings.currencyCode
    );
    const balanceRaw = await balanceProvider.getBalanceBlockchain(
      data.addressTo
    );
    if (
      balanceRaw &&
      typeof balanceRaw.balance !== 'undefined' &&
      balanceRaw.balance > 0
    ) {
      return { isOk: true };
    }

    const balanceProviderBasic = BlocksoftDispatcher.getScannerProcessor('TRX');
    const balanceRawBasic = await balanceProviderBasic.getBalanceBlockchain(
      data.addressTo
    );
    if (
      balanceRawBasic &&
      typeof balanceRawBasic.balance !== 'undefined' &&
      balanceRawBasic.balance > 0
    ) {
      return { isOk: true };
    }

    const transactionsBasic =
      await balanceProviderBasic.getTransactionsBlockchain({
        account: { address: data.addressTo }
      });
    if (transactionsBasic !== false) {
      return { isOk: true };
    }
    return { isOk: false, code: 'TRX_20', address: data.addressTo };
  }

  async getFeeRate(
    data: AirDAOBlockchainTypes.TransferData,
    privateData: AirDAOBlockchainTypes.TransferPrivateData,
    additionalData: {} = {}
  ): Promise<AirDAOBlockchainTypes.FeeRateResult> {
    const addressHexTo = TronUtils.addressToHex(data.addressTo);
    if (TronUtils.addressHexToStr(addressHexTo) !== data.addressTo) {
      AirDAOCryptoLog.log(
        'TrxTransferProcessor.getFeeRateOld check address ' +
          data.addressTo +
          ' hex ' +
          addressHexTo +
          ' => ' +
          TronUtils.addressHexToStr(addressHexTo)
      );
      throw new Error(
        'TRX SYSTEM ERROR - Please check address ' + data.addressTo
      );
    }

    try {
      const link =
        PROXY_FEE +
        '?from=' +
        data.addressFrom +
        '&fromHex=' +
        TronUtils.addressToHex(data.addressFrom) +
        '&to=' +
        data.addressTo +
        '&toHex=' +
        addressHexTo +
        '&token=' +
        this._tokenName +
        '&tokenHex=' +
        (this._isToken20 ? TronUtils.addressToHex(this._tokenName) : '') +
        '&amount=' +
        data.amount +
        '&isTransferAll=' +
        (data.isTransferAll ? 1 : 0);
      let res = false;
      try {
        res = await AirDAOAxios.get(link);
      } catch (e) {
        throw new Error('no proxy fee for ' + link);
      }
      res = res.data;
      if (config.debug.cryptoErrors) {
        console.log(
          this._settings.currencyCode +
            ' TrxTransferProcessor.getFeeRate ' +
            link +
            ' res ',
          res
        );
      }
      AirDAOCryptoLog.log(
        this._settings.currencyCode +
          ' TrxTransferProcessor.getFeeRate ' +
          link +
          ' res ',
        res
      );
      if (typeof res.feeForTx === undefined) {
        throw new Error('no res?.feeForTx');
      }

      let result;
      if (res.feeForTx * 1 > 0) {
        result = {
          selectedFeeIndex: 0,
          shouldShowFees: false,
          fees: [
            {
              langMsg: 'xrp_speed_one',
              feeForTx: Math.round(res.feeForTx).toString(),
              amountForTx: res?.amountForTx,
              selectedTransferAllBalance: res?.selectedTransferAllBalance,
              isErrorFee: res?.isErrorFee
            }
          ]
        };
      } else {
        result = {
          selectedFeeIndex: -3,
          shouldShowFees: false
        };
      }
      return result as unknown as AirDAOBlockchainTypes.FeeRateResult;
    } catch (e: any) {
      if (e.message.indexOf('SERVER_RESPONSE_') === 0) {
        throw e;
      }
      if (config.debug.cryptoErrors) {
        console.log(
          this._settings.currencyCode +
            ' TrxTransferProcessor.getFeeRate new error ' +
            e.message
        );
      }
      AirDAOCryptoLog.log(
        this._settings.currencyCode +
          ' TrxTransferProcessor.getFeeRate new error ' +
          e.message
      );
      return this.getFeeRateOld(data, privateData, additionalData);
    }
  }

  async getFeeRateOld(
    data: AirDAOBlockchainTypes.TransferData,
    privateData: AirDAOBlockchainTypes.TransferPrivateData,
    additionalData: {} = {}
  ): Promise<AirDAOBlockchainTypes.FeeRateResult> {
    const addressHexTo = TronUtils.addressToHex(data.addressTo);
    const result: AirDAOBlockchainTypes.FeeRateResult = {
      selectedFeeIndex: -3,
      shouldShowFees: false
    } as AirDAOBlockchainTypes.FeeRateResult;

    const sendLink = BlocksoftExternalSettings.getStatic('TRX_SEND_LINK');
    const link = sendLink + '/wallet/getaccountresource'; // http://trx.trusteeglobal.com:8090/wallet

    try {
      let feeForTx = 0;
      try {
        const res = await BlocksoftBalances.setCurrencyCode('TRX')
          .setAddress(data.addressFrom)
          .getResources('TrxSendTx');
        await AirDAOCryptoLog.log(
          this._settings.currencyCode +
            ' TrxTransferProcessor.getFeeRate result resources from ' +
            data.addressFrom,
          res
        );
        if (this._isToken20) {
          const bandForTx = BlocksoftExternalSettings.getStatic(
            'TRX_TRC20_BAND_PER_TX'
          );
          const priceForBand = BlocksoftExternalSettings.getStatic(
            'TRX_TRC20_PRICE_PER_BAND'
          );
          const fullPriceBand = bandForTx * priceForBand;
          let feeLog = '';
          if (res.leftBand <= 0) {
            feeForTx = fullPriceBand;
            feeLog +=
              ' res.leftBand<=0 bandFee=' +
              bandForTx +
              '*' +
              priceForBand +
              '=' +
              fullPriceBand;
          } else {
            const diffB = bandForTx - res.leftBand;
            feeLog += ' diffB=' + bandForTx + '-' + res.leftBand + '=' + diffB;
            if (diffB > 0) {
              feeForTx = BlocksoftUtils.mul(
                fullPriceBand,
                BlocksoftUtils.div(diffB, bandForTx)
              );
              feeLog +=
                ' fullPriceBand=' +
                bandForTx +
                '*' +
                priceForBand +
                '=' +
                fullPriceBand;
              feeLog +=
                ' bandFee=' +
                fullPriceBand +
                '*' +
                diffB +
                '/' +
                bandForTx +
                '=' +
                feeForTx;
            }
          }
          const energyForTx = BlocksoftExternalSettings.getStatic(
            'TRX_TRC20_ENERGY_PER_TX'
          );
          const priceForEnergy = BlocksoftExternalSettings.getStatic(
            'TRX_TRC20_PRICE_PER_ENERGY'
          );
          const fullPriceEnergy = energyForTx * priceForEnergy;
          if (res.leftEnergy <= 0) {
            feeForTx = feeForTx + fullPriceEnergy;
            feeLog +=
              ' res.leftEnergy<=0 energyFee=' +
              energyForTx +
              '*' +
              priceForEnergy +
              '=' +
              fullPriceEnergy;
          } else {
            const diffE = energyForTx - res.leftEnergy;
            feeLog +=
              ' diffE=' + energyForTx + '-' + res.leftEnergy + '=' + diffE;
            if (diffE > 0) {
              const energyFee =
                BlocksoftUtils.mul(
                  fullPriceEnergy,
                  BlocksoftUtils.div(diffE / energyForTx)
                ) * 1;
              feeForTx = feeForTx + energyFee;
              feeLog +=
                ' fullPriceEnergy=' +
                energyForTx +
                '*' +
                priceForEnergy +
                '=' +
                fullPriceEnergy;
              feeLog +=
                ' energyFee=' +
                fullPriceEnergy +
                '*' +
                diffE +
                '/' +
                bandForTx +
                '=' +
                energyFee;
            }
          }
          await AirDAOCryptoLog.log(
            this._settings.currencyCode +
              ' TrxTransferProcessor.getFeeRate feeForTx ' +
              feeForTx +
              ' calculated by ' +
              feeLog
          );
        } else {
          // @ts-ignore
          if (res.leftBand <= 0) {
            feeForTx = BlocksoftExternalSettings.getStatic(
              'TRX_BASIC_PRICE_WHEN_NO_BAND'
            );
          }
        }
      } catch (e: any) {
        // do nothing
        if (config.debug.cryptoErrors) {
          console.log(
            this._settings.currencyCode +
              ' TrxTransferProcessor.getFeeRate addressFrom data error ' +
              e.message
          );
        }
        AirDAOCryptoLog.log(
          this._settings.currencyCode +
            ' TrxTransferProcessor.getFeeRate addressFrom data error ' +
            e.message
        );
      }

      let isErrorFee = false;
      const balance = await BlocksoftBalances.setCurrencyCode('TRX')
        .setAddress(data.addressFrom)
        .getBalance('TrxSendTx');
      if (this._isToken20) {
        if (!balance || balance.balanceAvailable <= feeForTx) {
          isErrorFee = true;
          // throw new Error('SERVER_RESPONSE_NOT_ENOUGH_FEE')
        }
      } else if (this._tokenName === '_') {
        if (
          !balance ||
          balance.balanceAvailable <= feeForTx + data.amount * 1
        ) {
          isErrorFee = true;
          // throw new Error('SERVER_RESPONSE_NOT_ENOUGH_FEE')
        }
      }

      if (typeof data.dexOrderData === 'undefined' || !data.dexOrderData) {
        try {
          const res2 = await AirDAOAxios.post(link, {
            address: addressHexTo
          });
          const tronData2 = res2.data;
          delete tronData2.assetNetUsed;
          delete tronData2.assetNetLimit;
          await AirDAOCryptoLog.log(
            this._settings.currencyCode +
              ' TrxTransferProcessor.getFeeRate result ' +
              link +
              ' to ' +
              data.addressTo,
            tronData2
          );
          if (typeof tronData2.freeNetLimit === 'undefined') {
            feeForTx = feeForTx + 1100000;
          }
        } catch (e: any) {
          // do nothing
          if (config.debug.cryptoErrors) {
            console.log(
              this._settings.currencyCode +
                ' TrxTransferProcessor.getFeeRate addressTo data error ' +
                e.message
            );
          }
          AirDAOCryptoLog.log(
            this._settings.currencyCode +
              ' TrxTransferProcessor.getFeeRate addressTo data error ' +
              e.message
          );
        }
      }

      if (feeForTx !== 0) {
        let amountForTx = data.amount;
        let selectedTransferAllBalance = data.amount;
        if (this._tokenName === '_') {
          // tslint:disable-next-line:no-shadowed-variable
          const balance = await BlocksoftBalances.setCurrencyCode('TRX')
            .setAddress(data.addressFrom)
            .getBalance('TrxSendTx');
          if (balance && typeof balance.balance !== 'undefined') {
            if (balance.balance === 0) {
              amountForTx = String(0);
              selectedTransferAllBalance = String(0);
            } else {
              selectedTransferAllBalance = BlocksoftUtils.diff(
                balance.balance,
                feeForTx
              );
              const test = BlocksoftUtils.diff(data.amount, feeForTx);
              if (test * 1 > balance.balance * 1) {
                amountForTx = selectedTransferAllBalance;
              }
            }
          }
        }

        result.fees = [
          {
            langMsg: 'xrp_speed_one',
            feeForTx: Math.round(feeForTx).toString(),
            amountForTx,
            selectedTransferAllBalance,
            isErrorFee
          }
        ];
        /*
                if (res.data.balance * 1 < feeForTx * 1) {
                    throw new Error('SERVER_RESPONSE_BANDWITH_ERROR_TRX')
                }
                */
        result.selectedFeeIndex = 0;
      }
    } catch (e: any) {
      if (e.message.indexOf('SERVER_RESPONSE_') === 0) {
        throw e;
      }
      if (config.debug.cryptoErrors) {
        console.log(
          this._settings.currencyCode +
            ' TrxTransferProcessor.getFeeRate error ' +
            e.message
        );
      }
      AirDAOCryptoLog.log(
        this._settings.currencyCode +
          ' TrxTransferProcessor.getFeeRate error ' +
          e.message
      );
    }
    return result;
  }

  async getTransferAllBalance(
    data: AirDAOBlockchainTypes.TransferData,
    privateData: AirDAOBlockchainTypes.TransferPrivateData,
    additionalData: AirDAOBlockchainTypes.TransferAdditionalData = {}
  ): Promise<AirDAOBlockchainTypes.TransferAllBalanceResult> {
    data.isTransferAll = true;
    const balance = data.amount;
    // @ts-ignore
    await AirDAOCryptoLog.log(
      this._settings.currencyCode +
        ` TrxTransferProcessor.getTransferAllBalance ',
       ${data.addressFrom + ' => ' + balance}`
    );
    // noinspection EqualityComparisonWithCoercionJS
    if (balance === '0') {
      return {
        selectedTransferAllBalance: '0',
        selectedFeeIndex: -1,
        fees: [],
        shouldShowFees: false,
        countedForBasicBalance: '0'
      };
    }
    const fees = await this.getFeeRate(data, privateData, additionalData);
    if (!fees || fees.selectedFeeIndex < 0) {
      return {
        selectedTransferAllBalance: balance,
        selectedFeeIndex: -3,
        fees: [],
        shouldShowFees: false,
        countedForBasicBalance: balance
      };
    }
    return {
      ...fees,
      shouldShowFees: false,
      selectedTransferAllBalance:
        fees.fees[fees.selectedFeeIndex].selectedTransferAllBalance
    };
  }

  /**
   * https://developers.tron.network/reference#walletcreatetransaction
   * https://developers.tron.network/docs/trc20-introduction#section-8usdt-transfer
   */
  async sendTx(
    data: AirDAOBlockchainTypes.TransferData,
    privateData: AirDAOBlockchainTypes.TransferPrivateData,
    uiData: AirDAOBlockchainTypes.TransferUiData
  ): Promise<AirDAOBlockchainTypes.SendTxResult> {
    if (typeof privateData.privateKey === 'undefined') {
      throw new Error('TRX transaction required privateKey');
    }
    if (
      uiData.selectedFee.isErrorFee &&
      (typeof uiData.uiErrorConfirmed === 'undefined' ||
        !uiData.uiErrorConfirmed)
    ) {
      if (config.debug.cryptoErrors) {
        console.log(`uiData.selectedFee.isErrorFee`, uiData);
      }
      throw new Error('SERVER_RESPONSE_NOT_ENOUGH_FEE');
    }

    await AirDAOCryptoLog.log(
      this._settings.currencyCode +
        ' TrxTransferProcessor.sendTx started ' +
        data.addressFrom +
        ' => ' +
        data.addressTo
    );

    const logData = {
      currencyCode: strings,
      selectedFee: strings,
      from: strings,
      basicAddressTo: strings,
      basicAmount: strings,
      pushSetting: strings,
      pushLocale: undefined,
      basicToken: strings
    };
    logData.currencyCode = this._settings.currencyCode;
    logData.selectedFee = uiData.selectedFee;
    logData.from = data.addressFrom;
    logData.basicAddressTo = data.addressTo;
    logData.basicAmount = data.amount;
    logData.pushLocale = sublocale();
    logData.pushSetting = await settingsActions.getSetting(
      'transactionsNotifs'
    );
    logData.basicToken = this._tokenName;

    const sendLink = BlocksoftExternalSettings.getStatic('TRX_SEND_LINK');
    let tx;
    if (typeof data.blockchainData !== 'undefined' && data.blockchainData) {
      tx = data.blockchainData;
    } else {
      let link;
      let res;
      let params;

      if (typeof data.dexOrderData !== 'undefined' && data.dexOrderData) {
        // {"tokenContract":"41a2726afbecbd8e936000ed684cef5e2f5cf43008","contractMethod":"trxToTokenSwapInput(uint256)","options":{"callValue":"1000000"},"params":[{"type":"uint256","value":"116256"}]}
        let ownerAddress;

        const abiCoder = new AbiCoder();
        try {
          ownerAddress = TronUtils.addressToHex(data.addressFrom);
        } catch (e: any) {
          e.message +=
            ' inside TronUtils.addressToHex owner_address ' + data.addressFrom;
          throw e;
        }

        // tslint:disable-next-line:no-shadowed-variable
        const link = sendLink + '/wallet/triggersmartcontract';
        const total = data.dexOrderData.length;
        let index = 0;
        for (const order of data.dexOrderData) {
          index++;
          let parameter = '';

          if (order.params) {
            const types = [];
            const values = [];
            try {
              for (const tmp of order.params) {
                let type;
                let value;
                try {
                  type = tmp.type;
                  value = tmp.value;
                  if (type === 'address') {
                    value = TronUtils.addressToHex(value).replace(
                      ADDRESS_PREFIX_REGEX,
                      '0x'
                    );
                  } else if (type === 'address[]') {
                    value = value.map((v) =>
                      TronUtils.addressToHex(v).replace(
                        ADDRESS_PREFIX_REGEX,
                        '0x'
                      )
                    );
                  }
                  types.push(type);
                  values.push(value);
                } catch (e: any) {
                  throw new Error(
                    e.message +
                      ' type ' +
                      type +
                      ' tmp.value ' +
                      tmp.value +
                      ' value ' +
                      value
                  );
                }
              }
              parameter = abiCoder.encode(types, values).replace(/^(0x)/, '');
            } catch (e) {
              throw new Error(e.message + ' in abiCoder');
            }
          }

          // tslint:disable-next-line:no-shadowed-variable
          let params;
          try {
            params = {
              owner_address: ownerAddress,
              contract_address: order.tokenContract,
              function_selector: order.contractMethod,
              parameter,
              fee_limit: BlocksoftExternalSettings.getStatic(
                'TRX_TRC20_MAX_LIMIT'
              )
            };
            if (
              typeof order.options !== undefined &&
              typeof order.options.callValue !== undefined
            ) {
              params.call_value = order.options.callValue * 1;
            }
          } catch (e1: any) {
            throw new Error(e1.message + ' in params build');
          }
          if (index < total) {
            res = await AirDAOAxios.post(link, params);

            tx = res.data.transaction;
            await AirDAOCryptoLog.log(
              this._settings.currencyCode + ' TrxTxProcessor.sendSubTx tx',
              tx
            );

            tx.signature = [
              TronUtils.ECKeySign(
                Buffer.from(tx.txID, 'hex'),
                Buffer.from(privateData.privateKey, 'hex')
              )
            ];
            await AirDAOCryptoLog.log(
              this._settings.currencyCode + ' TrxTxProcessor.sendSubTx signed',
              tx
            );

            let resultSub = {} as AirDAOBlockchainTypes.SendTxResult;
            try {
              resultSub = await this.sendProvider.sendTx(
                tx,
                '',
                false,
                logData
              );
              await AirDAOCryptoLog.log(
                this._settings.currencyCode +
                  ' TrxTxProcessor.sendSubTx broadcasted'
              );
            } catch (e: any) {
              if (config.debug.cryptoErrors) {
                console.log(
                  this._settings.currencyCode +
                    ' TrxTransferProcessor.sendSubTx error',
                  e,
                  uiData
                );
              }
              AirDAOCryptoLog.log(
                this._settings.currencyCode +
                  ' TrxTransferProcessor.sendSubTx  error ' +
                  e.message
              );
              // noinspection ES6MissingAwait
              MarketingEvent.logOnlyRealTime(
                'v20_trx_tx_sub_error ' +
                  this._settings.currencyCode +
                  ' ' +
                  data.addressFrom +
                  ' => ' +
                  data.addressTo +
                  ' ' +
                  e.message,
                logData
              );
              throw e;
            }

            const linkRecheck = sendLink + '/wallet/gettransactioninfobyid';
            let checks = 0;
            let mined = false;
            do {
              checks++;
              try {
                const recheck = await AirDAOAxios.post(linkRecheck, {
                  value: tx.txID
                });
                if (typeof recheck.data !== undefined) {
                  if (
                    typeof recheck.data.id !== undefined &&
                    typeof recheck.data.blockNumber !== undefined &&
                    typeof recheck.data.receipt !== undefined &&
                    typeof recheck.data.receipt.result !== undefined
                  ) {
                    // @ts-ignore
                    AirDAOCryptoLog.log(
                      this._settings.currencyCode +
                        ' TrxTransferProcessor.sendSubTx recheck ',
                      {
                        id: recheck.data.id,
                        blockNumber: recheck.data.blockNumber,
                        receipt: recheck.data.receipt
                      }
                    );
                    mined = true;
                    const minedStatus =
                      recheck.data.receipt.result.toUpperCase();
                    if (minedStatus === 'OUT_OF_ENERGY') {
                      strings(`account.transactionStatuses.out_of_energy`);
                    } else if (minedStatus === 'FAILED') {
                      strings(`account.transactionStatuses.fail`);
                    } else if (minedStatus !== 'SUCCESS') {
                      throw new Error(
                        'Bad tx status ' + JSON.stringify(recheck.data.receipt)
                      );
                    }
                    break;
                  }
                }
              } catch (e1: any) {
                if (config.debug.cryptoErrors) {
                  console.log(
                    this._settings.currencyCode +
                      ' TRX transaction recheck error ',
                    e1
                  );
                }
                AirDAOCryptoLog.log(
                  this._settings.currencyCode +
                    ' TRX transaction recheck error ' +
                    e1.message
                );
              }
            } while (checks < 100 && !mined);
          } else {
            res = await AirDAOAxios.post(link, params);
          }
        }
      } else {
        if (typeof data.addressTo === 'undefined') {
          throw new Error('TRX transaction required addressTo');
        }
        if (data.addressFrom === data.addressTo) {
          throw new Error('SERVER_RESPONSE_SELF_TX_FORBIDDEN');
        }
        // check error
        await this.getFeeRate(data, privateData);

        let toAddress, ownerAddress;

        try {
          toAddress = TronUtils.addressToHex(data.addressTo);
        } catch (e: any) {
          e.message +=
            ' inside TronUtils.addressToHex to_address ' + data.addressTo;
          throw e;
        }

        if (TronUtils.addressHexToStr(toAddress) !== data.addressTo) {
          AirDAOCryptoLog.log(
            'TrxTransferProcessor.sendTx heck address ' +
              data.addressTo +
              ' hex ' +
              toAddress +
              ' => ' +
              TronUtils.addressHexToStr(toAddress)
          );
          throw new Error(
            'TRX SYSTEM ERROR - Please check address ' + data.addressTo
          );
        }

        try {
          ownerAddress = TronUtils.addressToHex(data.addressFrom);
        } catch (e: any) {
          e.message +=
            ' inside TronUtils.addressToHex owner_address ' + data.addressFrom;
          throw e;
        }

        if (this._tokenName[0] === 'T') {
          link = sendLink + '/wallet/triggersmartcontract';
          const parameter =
            '0000000000000000000000' +
            toAddress.toUpperCase() +
            '000000000000000000000000' +
            BlocksoftUtils.decimalToHex(BlocksoftUtils.round(data.amount), 40);
          params = {
            owner_address: ownerAddress,
            contract_address: TronUtils.addressToHex(this._tokenName),
            function_selector: 'transfer(address,uint256)',
            parameter,
            fee_limit: BlocksoftExternalSettings.getStatic(
              'TRX_TRC20_MAX_LIMIT'
            ),
            call_value: 0
          };
          await AirDAOCryptoLog.log(
            this._settings.currencyCode +
              `' TrxTransferProcessor.sendTx inited1' +
              ${data.addressFrom} +
              ' => ' +
              ${data.addressTo} +
              ' ' +
              ${link},
            ${params}`
          );
          res = await AirDAOAxios.post(link, params);
        } else {
          params = {
            owner_address: ownerAddress,
            to_address: toAddress,
            amount: BlocksoftUtils.round(data.amount) * 1
          };

          if (this._tokenName === '_') {
            link = sendLink + '/wallet/createtransaction';
          } else {
            // @ts-ignore
            params.asset_name =
              '0x' + Buffer.from(this._tokenName).toString('hex');
            link = sendLink + '/wallet/transferasset';
          }

          try {
            await AirDAOCryptoLog.log(
              this._settings.currencyCode +
                `' TrxTransferProcessor.sendTx inited2' +
              ${data.addressFrom} +
              ' => ' +
              ${data.addressTo} +
              ' ' +
              ${link},
            ${params}`
            );
            res = await AirDAOAxios.post(link, params);
          } catch (e: any) {
            await AirDAOCryptoLog.log(
              this._settings.currencyCode +
                ' TrxTransferProcessor.sendTx result2' +
                data.addressFrom +
                ' => ' +
                data.addressTo +
                ' ' +
                link +
                ' ' +
                e.message
            );
            if (
              e.message.indexOf('timeout of') !== -1 ||
              e.message.indexOf('network') !== -1
            ) {
              throw new Error('SERVER_RESPONSE_NOT_CONNECTED');
            } else {
              throw e;
            }
          }
        }
      }

      // @ts-ignore
      if (typeof res.data.Error !== 'undefined') {
        await AirDAOCryptoLog.log(
          this._settings.currencyCode +
            `' TrxTransferProcessor.sendTx error ' +
            ${data.addressFrom} +
            ' => ' +
            ${data.addressTo} +
            ' ',
          ${res.data}`
        );
        // @ts-ignore
        this.sendProvider.trxError(res.data.Error.message || res.data.Error);
      }

      // @ts-ignore
      tx = res.data;
      if (
        (typeof data.dexOrderData !== 'undefined' && data.dexOrderData) ||
        this._tokenName[0] === 'T'
      ) {
        // @ts-ignore
        if (
          typeof res.data.transaction === 'undefined' ||
          typeof res.data.result === 'undefined'
        ) {
          // @ts-ignore
          if (typeof res.data.result.message !== 'undefined') {
            // @ts-ignore
            res.data.result.message = BlocksoftUtils.hexToUtf(
              '0x' + res.data.result.message
            );
          }
          // @ts-ignore
          this.sendProvider.trxError(
            'No tx in contract data ' + JSON.stringify(res.data)
          );
        }
        // @ts-ignore
        tx = res.data.transaction;
      } else {
        // @ts-ignore
        if (typeof res.data.txID === undefined) {
          // @ts-ignore
          if (typeof res.data.result.message !== undefined) {
            // @ts-ignore
            res.data.result.message = BlocksoftUtils.hexToUtf(
              '0x' + res.data.result.message
            );
          }
          // @ts-ignore
          this.sendProvider.trxError(
            'No txID in data ' + JSON.stringify(res.data)
          );
        }
      }
    }

    await AirDAOCryptoLog.log(
      this._settings.currencyCode +
        ' TrxTxProcessor.sendTx token ' +
        this._tokenName +
        ' tx',
      tx
    );

    tx.signature = [
      TronUtils.ECKeySign(
        Buffer.from(tx.txID, 'hex'),
        Buffer.from(privateData.privateKey, 'hex')
      )
    ];
    if (
      typeof uiData !== 'undefined' &&
      typeof uiData.selectedFee !== 'undefined' &&
      typeof uiData.selectedFee.rawOnly !== 'undefined' &&
      uiData.selectedFee.rawOnly
    ) {
      return { rawOnly: uiData.selectedFee.rawOnly, raw: JSON.stringify(tx) };
    }

    await AirDAOCryptoLog.log(
      this._settings.currencyCode + ' TrxTxProcessor.sendTx signed',
      tx
    );

    let result = {} as AirDAOBlockchainTypes.SendTxResult;
    try {
      result = await this.sendProvider.sendTx(tx, '', false, logData);
      await AirDAOCryptoLog.log(
        this._settings.currencyCode + ' TrxTxProcessor.sendTx broadcasted'
      );
    } catch (e: any) {
      if (config.debug.cryptoErrors) {
        console.log(
          this._settings.currencyCode + ' TrxTransferProcessor.sendTx error',
          e,
          uiData
        );
      }
      AirDAOCryptoLog.log(
        this._settings.currencyCode +
          ' TrxTransferProcessor.sendTx error ' +
          e.message
      );
      // noinspection ES6MissingAwait
      MarketingEvent.logOnlyRealTime(
        'v20_trx_tx_error ' +
          this._settings.currencyCode +
          ' ' +
          data.addressFrom +
          ' => ' +
          data.addressTo +
          ' ' +
          e.message,
        logData
      );
      throw e;
    }
    // noinspection ES6MissingAwait
    MarketingEvent.logOnlyRealTime(
      'v20_trx_tx_success ' +
        this._settings.currencyCode +
        ' ' +
        data.addressFrom +
        ' => ' +
        data.addressTo,
      logData
    );

    await BlocksoftTransactions.resetTransactionsPending(
      { account: { currencyCode: 'TRX' } },
      'AccountRunPending'
    );

    if (config.debug.cryptoErrors) {
      console.log(
        this._settings.currencyCode + ' TrxTransferProcessor.sendTx result',
        JSON.parse(JSON.stringify(result))
      );
    }
    return result;
  }
}
