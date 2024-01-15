import AirDAOUtils from '../../common/AirDAOUtils';

import EthTmpDS from './stores/EthTmpDS';

import EthEstimateGas from './ext/EthEstimateGas';
import EthBasic from './basic/EthBasic';
import EthNetworkPrices from './basic/EthNetworkPrices';
import EthTxSendProvider from './basic/EthTxSendProvider';

import AirDAODispatcher from '../AirDAODispatcher';
import { AirDAOBlockchainTypes } from '../AirDAOBlockchainTypes';

import AirDAOExternalSettings from '../../common/AirDAOExternalSettings';
import abi721 from './ext/erc721.js';
import abi1155 from './ext/erc1155';
import AirDAOAxios from '@crypto/common/AirDAOAxios';
import OneUtils from '@crypto/blockchains/one/ext/OneUtils';
import { Database } from '@database';

export default class EthTransferProcessor
  extends EthBasic
  implements AirDAOBlockchainTypes.TransferProcessor
{
  _useThisBalance = true;

  needPrivateForFee(): boolean {
    return false;
  }

  checkSendAllModal(data: { currencyCode: any }): boolean {
    return true;
  }

  async getFeeRate(
    data: AirDAOBlockchainTypes.TransferData,
    privateData?: AirDAOBlockchainTypes.TransferPrivateData,
    additionalData: AirDAOBlockchainTypes.TransferAdditionalData = {}
  ): Promise<AirDAOBlockchainTypes.FeeRateResult> {
    let txRBFed = '';
    let txRBF = false;
    this.checkWeb3CurrentServerUpdated();

    let realAddressTo = data.addressTo;
    if (realAddressTo !== '' && OneUtils.isOneAddress(realAddressTo)) {
      realAddressTo = OneUtils.fromOneAddress(realAddressTo);
    }
    if (
      typeof data.transactionRemoveByFee !== 'undefined' &&
      data.transactionRemoveByFee
    ) {
      txRBF = data.transactionRemoveByFee;
      txRBFed = 'RBFremoved';
    } else if (
      typeof data.transactionReplaceByFee !== 'undefined' &&
      data.transactionReplaceByFee
    ) {
      txRBF = data.transactionReplaceByFee;
      txRBFed = 'RBFed';
    } else if (typeof data.dexOrderData !== 'undefined' && data.dexOrderData) {
      // ignore
    } else {
      const realAddressToLower = realAddressTo.toLowerCase();
      txRBFed = 'usualSend';
      if (
        realAddressTo !== '' &&
        (realAddressToLower.indexOf('0x') === -1 ||
          realAddressToLower.indexOf('0x') !== 0)
      ) {
        throw new Error('SERVER_RESPONSE_BAD_DESTINATION');
      }
    }
    let oldGasPrice = -1;
    let oldNonce = -1;
    let nonceLog = '';
    if (txRBF) {
      oldGasPrice =
        typeof data.transactionJson !== 'undefined' &&
        typeof data.transactionJson.gasPrice !== 'undefined'
          ? data.transactionJson.gasPrice
          : false;
      oldNonce =
        typeof data.transactionJson !== 'undefined' &&
        typeof data.transactionJson.nonce !== 'undefined'
          ? data.transactionJson.nonce
          : false;
      if (!oldGasPrice) {
        try {
          const ethProvider = AirDAODispatcher.getScannerProcessor(
            data.currencyCode
          );
          const scannedTx = await ethProvider.getTransactionBlockchain(txRBF);
          if (scannedTx) {
            oldGasPrice = scannedTx.gasPrice;
            oldNonce = scannedTx.nonce;
          }
        } catch (e: any) {
          //ignore
        }
      }
      nonceLog += ' txRBFNonce ' + oldNonce;
    } else if (
      typeof additionalData.nonceForTx !== 'undefined' &&
      additionalData.nonceForTx !== -1
    ) {
      oldNonce = additionalData.nonceForTx;
      nonceLog += ' customFeeNonce ' + oldNonce;
    }

    let gasPrice = {};

    let maxNonceLocal = await EthTmpDS.getMaxNonce(
      this._mainCurrencyCode,
      data.addressFrom
    );
    const ethAllowBlockedBalance = await Database.localStorage.get(
      'ethAllowBlockedBalance'
    );
    const ethAllowLongQuery = await Database.localStorage.get(
      'ethAllowLongQuery'
    );

    const proxyPriceCheck = await EthNetworkPrices.getWithProxy(
      this._mainCurrencyCode,
      this._isTestnet,
      typeof data.addressFrom !== 'undefined' ? data.addressFrom : 'none',
      {
        data,
        additionalData,
        feesSource: 'EthTransferProcessor',
        feesOldNonce: oldNonce,
        ethAllowBlockedBalance,
        ethAllowLongQuery,
        maxNonceLocal
      }
    );

    if (
      typeof additionalData.gasPrice !== 'undefined' &&
      additionalData.gasPrice
    ) {
      if (typeof additionalData.gasPriceTitle !== 'undefined') {
        // @ts-ignore
        gasPrice[additionalData.gasPriceTitle] = additionalData.gasPrice;
      } else {
        gasPrice = { speed_blocks_12: additionalData.gasPrice };
      }
    } else if (
      typeof additionalData.prices !== 'undefined' &&
      additionalData.prices
    ) {
      gasPrice = additionalData.prices;
    } else if (proxyPriceCheck) {
      let tmp = 0;
      if (typeof data.dexOrderData !== 'undefined' && data.dexOrderData) {
        tmp =
          typeof data.dexOrderData[0].params.gasPrice !== 'undefined'
            ? data.dexOrderData[0].params.gasPrice
            : 0;
        if (tmp > 0) {
          gasPrice = { speed_blocks_2: tmp };
        }
      } else if (
        typeof data.walletConnectData !== 'undefined' &&
        typeof data.walletConnectData.gasPrice !== 'undefined' &&
        data.walletConnectData.gasPrice
      ) {
        tmp = AirDAOUtils.hexToDecimalWalletConnect(
          data.walletConnectData.gasPrice
        );
        if (tmp > 0) {
          gasPrice = { speed_blocks_2: tmp };
        }
      }
      if (!tmp) {
        gasPrice =
          typeof proxyPriceCheck.gasPrice !== 'undefined' &&
          proxyPriceCheck.gasPrice
            ? proxyPriceCheck.gasPrice
            : { speed_blocks_12: '10' };
      }
      if (
        typeof proxyPriceCheck.maxNonceLocal !== 'undefined' &&
        proxyPriceCheck.maxNonceLocal
      ) {
        maxNonceLocal = proxyPriceCheck.maxNonceLocal;
      }
    }

    if (typeof this._web3.LINK === 'undefined') {
      throw new Error('EthTransferProcessor need this._web3.LINK');
    }

    let gasLimit = 0;
    try {
      if (
        typeof additionalData === 'undefined' ||
        typeof additionalData.gasLimit === 'undefined' ||
        !additionalData.gasLimit
      ) {
        if (typeof data.dexOrderData !== 'undefined' && data.dexOrderData) {
          gasLimit =
            typeof data.dexOrderData[0].params.gas !== 'undefined'
              ? data.dexOrderData[0].params.gas
              : 0;
        } else if (
          typeof data.walletConnectData !== 'undefined' &&
          typeof data.walletConnectData.gas !== 'undefined' &&
          data.walletConnectData.gas &&
          data.walletConnectData.gas !== '0x0'
        ) {
          gasLimit = AirDAOUtils.hexToDecimalWalletConnect(
            data.walletConnectData.gas
          );
        } else if (typeof data.walletConnectData !== 'undefined') {
          const params = {
            jsonrpc: '2.0',
            method: 'eth_estimateGas',
            params: [
              {
                from:
                  typeof data.walletConnectData.from &&
                  data.walletConnectData.from
                    ? data.walletConnectData.from
                    : data.addressFrom,
                to:
                  typeof data.walletConnectData.to && data.walletConnectData.to
                    ? data.walletConnectData.to
                    : realAddressTo,
                value:
                  typeof data.walletConnectData.value !== 'undefined' &&
                  data.walletConnectData.value
                    ? data.walletConnectData.value
                    : data.amount.indexOf('0x') === 0
                    ? data.amount
                    : '0x' + AirDAOUtils.decimalToHex(data.amount),
                data:
                  typeof data.walletConnectData.data !== 'undefined' &&
                  data.walletConnectData.data
                    ? data.walletConnectData.data
                    : '0x'
              }
            ],
            id: 1
          };
          const tmp = await AirDAOAxios.postWithoutBraking(
            this._web3.LINK,
            params
          );
          if (typeof tmp !== 'undefined' && typeof tmp.data !== 'undefined') {
            if (typeof tmp.data.result !== 'undefined') {
              gasLimit =
                AirDAOUtils.hexToDecimalWalletConnect(tmp.data.result) * 1 +
                150000;
            } else if (typeof tmp.data.error !== 'undefined') {
              throw new Error(tmp.data.error.message);
            }
          } else {
            gasLimit = 500000;
          }
        } else if (
          typeof data.contractCallData !== 'undefined' &&
          typeof data.contractCallData.contractAddress !== 'undefined'
        ) {
          const schema = data.contractCallData.contractSchema;
          let abiCode;
          if (schema === 'ERC721') {
            abiCode = abi721.ERC721;
          } else if (schema === 'ERC1155') {
            abiCode = abi1155.ERC1155;
          } else {
            throw new Error('Contract abi not found ' + schema);
          }
          const token = new this._web3.eth.Contract(
            abiCode,
            data.contractCallData.contractAddress
          );

          gasLimit = 150000;
          try {
            const tmpParams = data.contractCallData.contractActionParams;
            for (let i = 0, ic = tmpParams.length; i < ic; i++) {
              if (tmpParams[i] === 'addressTo') {
                tmpParams[i] = realAddressTo;
              }
            }
            gasLimit = await token.methods[
              data.contractCallData.contractAction
            ](...tmpParams).estimateGas({ from: data.addressFrom });
            if (gasLimit) {
              gasLimit = AirDAOUtils.mul(gasLimit, 1.5);
            }
          } catch (e: any) {
            // do nothing
          }

          if (gasLimit <= 150000) {
            gasLimit = 150000;
          }
        } else {
          try {
            let ok = false;
            let i = 0;
            let gasLimitNew = false;
            do {
              try {
                i++;
                gasLimitNew = await EthEstimateGas(
                  this._web3.LINK,
                  gasPrice.speed_blocks_2 || gasPrice.speed_blocks_12,
                  data.addressFrom,
                  realAddressTo,
                  data.amount
                ); // it doesn't matter what the price of gas is, just a required parameter
              } catch (e1) {
                ok = false;
                if (i > 3) {
                  throw e1;
                }
              }
            } while (!ok && i <= 5);
            if (
              gasLimitNew &&
              typeof gasLimitNew !== 'undefined' &&
              gasLimitNew * 1 > 0
            ) {
              gasLimit = gasLimitNew * 1;
            }
          } catch (e) {
            if (e.message.indexOf('resolve host') !== -1) {
              throw new Error('SERVER_RESPONSE_NOT_CONNECTED');
            } else {
              gasLimit = AirDAOExternalSettings.getStatic('ETH_MIN_GAS_LIMIT');
              // e.message += ' in EthEstimateGas in getFeeRate'
              // throw e
            }
          }
          if (!gasLimit || typeof gasLimit !== 'undefined') {
            gasLimit = AirDAOExternalSettings.getStatic('ETH_MIN_GAS_LIMIT');
          }

          const minGasLimit =
            AirDAOExternalSettings.getStatic(
              this._mainCurrencyCode + '_MIN_GAS_LIMIT'
            ) * 1;
          if (minGasLimit > 0 && gasLimit < minGasLimit) {
            gasLimit = minGasLimit;
          }
        }
      } else {
        gasLimit = additionalData.gasLimit;
      }
    } catch (e) {
      throw new Error(e.message + ' in get gasLimit');
    }

    let showBigGasNotice = false;
    if (
      typeof additionalData === 'undefined' ||
      typeof additionalData.isCustomFee === 'undefined' ||
      !additionalData.isCustomFee
    ) {
      try {
        const limit = AirDAOExternalSettings.getStatic(
          this._mainCurrencyCode + '_GAS_LIMIT'
        );
        if (gasLimit * 1 > limit * 1) {
          showBigGasNotice = true;
        }
      } catch (e) {
        throw new Error(e.message + ' in get showBigGasNotice');
      }
    }

    if (!gasLimit) {
      throw new Error('invalid transaction (no gas limit.2)');
    }

    const result: AirDAOBlockchainTypes.FeeRateResult =
      {} as AirDAOBlockchainTypes.FeeRateResult;
    result.fees = [];

    let balance = '0';
    let actualCheckBalance;
    let nonceForTx = -1;
    let isNewNonce = true;
    if (
      typeof data.transactionJson !== 'undefined' &&
      typeof data.transactionJson.nonce !== 'undefined' &&
      data.transactionJson.nonce
    ) {
      nonceForTx = data.transactionJson.nonce;
      nonceLog += ' from transactionJSON';
    } else {
      let nonceForTxBasic =
        maxNonceLocal.maxValue * 1 > maxNonceLocal.maxScanned * 1
          ? maxNonceLocal.maxValue
          : maxNonceLocal.maxScanned;
      if (proxyPriceCheck && typeof proxyPriceCheck.newNonce !== 'undefined') {
        nonceForTxBasic = proxyPriceCheck.newNonce;
        if (typeof proxyPriceCheck.logNonce !== 'undefined') {
          nonceLog += ' from serverCheck ' + proxyPriceCheck.logNonce;
        } else {
          nonceLog += ' from serverCheckNoLog ';
        }
        nonceLog += ' used newNonce ';

        if (nonceForTxBasic === 'maxValue+1') {
          if (maxNonceLocal.maxValue * 1 > -1) {
            nonceForTxBasic = maxNonceLocal.maxValue + 1;
            nonceLog += ' usedMax ' + JSON.stringify(maxNonceLocal);
          } else {
            nonceForTxBasic = -1;
            nonceLog += ' noMax => -1 ';
          }
        }
        nonceLog += ' nonceForTxBasic ' + nonceForTxBasic;
      } else if (nonceForTxBasic * 1 >= 0) {
        nonceLog += ' used localNonce ' + JSON.stringify(maxNonceLocal);
        nonceLog += ' nonceForTxBasic ' + nonceForTxBasic;
        nonceForTxBasic = nonceForTxBasic * 1 + 1;
      } else {
        nonceLog += ' used noLocalNoServer ' + JSON.stringify(nonceForTxBasic);
      }

      if (
        oldNonce !== false &&
        oldNonce * 1 > -1 &&
        oldNonce !== nonceForTxBasic
      ) {
        nonceForTx = oldNonce;
        isNewNonce = false;
        nonceLog =
          'recheck oldNonce ' +
          oldNonce +
          ' with basic ' +
          nonceForTxBasic +
          nonceLog;
      } else {
        nonceForTx = nonceForTxBasic;
        isNewNonce = true;
        nonceLog =
          'recheck nonce ' +
          oldNonce +
          ' replaced by basic ' +
          nonceForTxBasic +
          nonceLog;
      }
    }

    if (data.isTransferAll && this._useThisBalance) {
      balance = data.amount;
      actualCheckBalance = true;
    } else {
      try {
        // @ts-ignore
        balance =
          additionalData.balance ||
          (await this._web3.eth.getBalance(data.addressFrom));
        // @ts-ignore
        if (!balance || balance * 1 === 0) {
          actualCheckBalance = false;
        } else {
          actualCheckBalance = true;
        }
      } catch (e) {
        actualCheckBalance = false;
      }
    }
    const titles = ['eth_speed_slow', 'eth_speed_medium', 'eth_speed_fast'];
    const titlesChanged = [
      'eth_speed_slowest',
      'eth_speed_medium_to_slow',
      'eth_speed_fast_to_medium'
    ];
    const keys = ['speed_blocks_12', 'speed_blocks_6', 'speed_blocks_2'];
    let skippedByOld = false;
    let prevGasPrice = 0;
    const feesOK = {};
    for (let index = 0; index <= 2; index++) {
      const key = keys[index];
      if (typeof gasPrice[key] === 'undefined') continue;
      if (gasPrice[key] <= oldGasPrice) {
        skippedByOld = true;
        continue;
      }
      let fee = AirDAOUtils.mul(gasPrice[key], gasLimit);
      let amount = data.amount;
      const needSpeed = gasPrice[key].toString();
      let newGasPrice = needSpeed;
      let changedFeeByBalance = false;
      if (actualCheckBalance) {
        const tmp = AirDAOUtils.diff(balance, fee).toString();
        if (this._useThisBalance) {
          if (tmp * 1 < 0) {
            continue;
          }
          if (data.isTransferAll) {
            amount = tmp;
          } else {
            const tmp2 = AirDAOUtils.diff(tmp, amount).toString();
            if (tmp2 * 1 < 0) {
              continue;
            }
          }
        } else {
          if (tmp * 1 < 0) {
            const tmpGasPrice = AirDAOUtils.div(balance, gasLimit).toString();
            if (
              tmpGasPrice &&
              AirDAOUtils.diff(tmpGasPrice, prevGasPrice).toString() * 1 > 0
            ) {
              fee = balance;
              newGasPrice = tmpGasPrice.split('.')[0];
              changedFeeByBalance = true;
            } else {
              continue;
            }
          }
        }
      }
      if (typeof newGasPrice === 'undefined' || newGasPrice === 'undefined') {
        newGasPrice = '0';
      } else {
        newGasPrice = newGasPrice.toString();
      }

      let langMsg = titles[index];
      if (changedFeeByBalance) {
        if (index > 0) {
          langMsg = titlesChanged[index - 1];
        }
      }

      let gweiFee = 0;
      try {
        gweiFee =
          newGasPrice !== '0'
            ? AirDAOUtils.toGwei(newGasPrice).toString()
            : newGasPrice;
      } catch (e) {
        // ignore
      }

      const tmp = {
        langMsg,
        gasPrice: newGasPrice,
        gasPriceGwei: gweiFee,
        gasLimit: gasLimit.toString(),
        feeForTx: fee.toString(),
        nonceForTx,
        nonceLog,
        needSpeed,
        ethAllowBlockedBalance,
        ethAllowLongQuery,
        isTransferAll: data.isTransferAll,
        amountForTx: amount
      };

      const diff = needSpeed - newGasPrice;
      if (!changedFeeByBalance || diff * 1 < 1000) {
        feesOK[titles[index]] = tmp.gasPrice;
      }
      if (
        AirDAOUtils.diff(newGasPrice, prevGasPrice).indexOf('-') === -1 &&
        newGasPrice !== prevGasPrice
      ) {
        prevGasPrice = tmp.gasPrice;
        result.fees.push(tmp);
      }
    }

    prevGasPrice = 0;
    if (txRBF) {
      let recheck = result.fees.length < 2;
      if (
        typeof additionalData.isCustomFee !== 'undefined' &&
        additionalData.isCustomFee
      ) {
        recheck = result.fees.length === 0;
      }
      if (recheck) {
        for (let index = 0; index <= 2; index++) {
          if (typeof result.fees[index] !== 'undefined') {
            result.fees[index].langMsg = titles[index];
            continue;
          }
          let newGasPrice = Math.round((oldGasPrice * (10 + index + 1)) / 10);
          const title = titles[index];
          const key = keys[index];
          const needSpeed = gasPrice[key];
          if (newGasPrice < gasPrice[key]) {
            newGasPrice = gasPrice[key];
          }
          let fee = AirDAOUtils.mul(newGasPrice, gasLimit);
          let amount = data.amount;
          if (actualCheckBalance) {
            const tmp = AirDAOUtils.diff(balance, fee).toString();
            if (this._useThisBalance) {
              if (tmp * 1 < 0) {
                continue;
              }
              if (data.isTransferAll) {
                amount = tmp;
              } else {
                const tmp2 = AirDAOUtils.diff(tmp, amount).toString();
                if (tmp2 * 1 < 0) {
                  amount = tmp;
                }
              }
            } else {
              if (tmp * 1 < 0) {
                const tmpGasPrice = AirDAOUtils.div(
                  balance,
                  gasLimit
                ).toString();
                if (
                  AirDAOUtils.diff(tmpGasPrice, prevGasPrice).toString() * 1 >
                  0
                ) {
                  fee = balance;
                  newGasPrice = tmpGasPrice;
                } else {
                  continue;
                }
              }
            }
          }

          if (typeof newGasPrice === 'undefined') {
            newGasPrice = '0';
          } else {
            newGasPrice = newGasPrice.toString();
            newGasPrice = AirDAOUtils.round(newGasPrice);
          }

          let gweiFee = 0;
          try {
            gweiFee =
              newGasPrice !== '0'
                ? AirDAOUtils.toGwei(newGasPrice).toString()
                : newGasPrice;
          } catch (e) {
            // ignore
          }

          const tmp = {
            langMsg: title,
            gasPrice: newGasPrice,
            gasPriceGwei: gweiFee,
            gasLimit: gasLimit.toString(),
            feeForTx: fee.toString(),
            amountForTx: amount,
            nonceForTx,
            nonceLog,
            needSpeed,
            ethAllowBlockedBalance,
            ethAllowLongQuery,
            isTransferAll: data.isTransferAll
          };
          // @ts-ignore
          prevGasPrice = tmp.gasPrice;
          result.fees.push(tmp);
        }
      }
    }

    if (balance !== '0' && result.fees.length === 0) {
      const index = 0;
      let feeForTx;
      let amountForTx = data.amount;
      let leftForFee = balance;
      if (this._useThisBalance && !data.isTransferAll) {
        if (txRBF) {
          leftForFee = AirDAOUtils.diff(
            balance,
            AirDAOUtils.div(data.amount, 2)
          ); // if eth is transferred and paid in eth - so amount is not changed except send all
        } else {
          leftForFee = AirDAOUtils.diff(balance, data.amount); // if eth is transferred and paid in eth - so amount is not changed except send all
        }
      }

      let fee = AirDAOUtils.div(leftForFee, gasLimit);
      if (fee) {
        const tmp = fee.split('.');
        if (tmp) {
          fee = tmp[0];
          feeForTx = AirDAOUtils.mul(fee, gasLimit);
          if (this._useThisBalance && (data.isTransferAll || txRBF)) {
            amountForTx = AirDAOUtils.diff(balance, feeForTx); // change amount for send all calculations
          }
        } else {
          feeForTx = 0;
        }
      } else {
        feeForTx = 0;
      }
      if (!feeForTx) {
        throw new Error('SERVER_RESPONSE_NOT_ENOUGH_AMOUNT_FOR_ANY_FEE');
      }
      if (typeof fee === 'undefined') {
        fee = '0';
      } else {
        fee = fee.toString();
      }
      const needSpeed =
        typeof keys[index] !== 'undefined' &&
        typeof gasPrice[keys[index]] !== 'undefined'
          ? gasPrice[keys[index]].toString()
          : '?';
      let gweiFee = 0;
      try {
        gweiFee = fee !== '0' ? AirDAOUtils.toGwei(fee).toString() : fee;
      } catch (e) {
        // ignore
      }
      const tmp = {
        langMsg: 'eth_speed_slowest',
        gasPrice: fee,
        gasPriceGwei: gweiFee,
        gasLimit: gasLimit.toString(),
        feeForTx,
        amountForTx,
        nonceForTx,
        nonceLog,
        needSpeed,
        ethAllowBlockedBalance,
        ethAllowLongQuery,
        isTransferAll: data.isTransferAll
      };
      if (tmp.gasPrice > 0) {
        result.fees.push(tmp);
      } else {
        throw new Error('SERVER_RESPONSE_NOT_ENOUGH_AMOUNT_FOR_ANY_FEE');
      }
    }

    if (!skippedByOld) {
      if (typeof feesOK['eth_speed_fast'] === 'undefined') {
        result.showSmallFeeNotice = new Date().getTime();
      }
    }

    result.selectedFeeIndex = result.fees.length - 1;
    result.countedForBasicBalance = actualCheckBalance ? balance : '0';
    if (!txRBF) {
      let check =
        ethAllowBlockedBalance !== '1' &&
        isNewNonce &&
        maxNonceLocal.amountBlocked &&
        typeof maxNonceLocal.amountBlocked[this._settings.currencyCode] !==
          'undefined';
      if (check) {
        try {
          const diff = AirDAOUtils.diff(
            result.countedForBasicBalance,
            maxNonceLocal.amountBlocked[this._settings.currencyCode]
          ).toString();
          const diffAmount = AirDAOUtils.diff(diff, data.amount).toString();
          if (diff.indexOf('-') !== -1) {
            result.showBlockedBalanceNotice = new Date().getTime();
            result.showBlockedBalanceFree =
              '0 ' + this._settings.currencySymbol;
          } else {
            if (diffAmount.indexOf('-') !== -1) {
              result.showBlockedBalanceNotice = new Date().getTime();
              result.showBlockedBalanceFree =
                AirDAOUtils.toUnified(diff, this._settings.decimals) +
                ' ' +
                this._settings.currencySymbol;
            }
          }
        } catch (e) {
          // ignore
        }
      }
      const LONG_QUERY = await AirDAOExternalSettings.getStatic(
        'ETH_LONG_QUERY'
      );
      check = maxNonceLocal.queryLength * 1 >= LONG_QUERY * 1;
      if (check) {
        result.showLongQueryNotice = new Date().getTime();
        result.showLongQueryNoticeTxs = maxNonceLocal.queryTxs;
      }
    } else {
      for (const fee of result.fees) {
        fee.showNonce = true;
      }
    }
    result.showBigGasNotice = showBigGasNotice ? new Date().getTime() : 0;
    return result;
  }

  async getTransferAllBalance(
    data: AirDAOBlockchainTypes.TransferData,
    privateData?: AirDAOBlockchainTypes.TransferPrivateData,
    additionalData: AirDAOBlockchainTypes.TransferAdditionalData = {}
  ): Promise<AirDAOBlockchainTypes.TransferAllBalanceResult> {
    if (!data.amount || data.amount === '0') {
      try {
        // @ts-ignore
        data.amount = await this._web3.eth
          .getBalance(data.addressFrom)
          .toString();
      } catch (e) {
        this.checkError(e, data);
      }
    }

    // noinspection EqualityComparisonWithCoercionJS
    if (data.amount === '0' || data.amount === '') {
      return {
        selectedTransferAllBalance: '0',
        selectedFeeIndex: -1,
        fees: [],
        countedForBasicBalance: '0'
      };
    }

    const fees = await this.getFeeRate(data, privateData, additionalData);

    if (!fees || fees.selectedFeeIndex < 0) {
      return {
        selectedTransferAllBalance: '0',
        selectedFeeIndex: -2,
        fees: [],
        countedForBasicBalance: '0'
      };
    }
    if (this._useThisBalance) {
      try {
        for (const fee of fees.fees) {
          fee.totalFeePlusAmountETH = AirDAOUtils.toEther(
            AirDAOUtils.add(fee.amountForTx, fee.feeForTx)
          );
        }
        fees.selectedTransferAllBalanceETH = AirDAOUtils.toEther(
          fees.fees[fees.selectedFeeIndex].amountForTx
        );
      } catch (e: any) {
        // ignore
      }
    }
    return {
      ...fees,
      selectedTransferAllBalance: fees.fees[fees.selectedFeeIndex].amountForTx
    };
  }

  async sendTx(
    data: AirDAOBlockchainTypes.TransferData,
    privateData: AirDAOBlockchainTypes.TransferPrivateData,
    uiData: AirDAOBlockchainTypes.TransferUiData
  ): Promise<AirDAOBlockchainTypes.SendTxResult> {
    if (typeof privateData.privateKey === 'undefined') {
      throw new Error('ETH transaction required privateKey');
    }
    if (typeof data.addressTo === 'undefined') {
      throw new Error('ETH transaction required addressTo');
    }

    let txRBFed = '';
    let txRBF = false;
    let realAddressTo = data.addressTo;
    if (realAddressTo !== '' && OneUtils.isOneAddress(realAddressTo)) {
      realAddressTo = OneUtils.fromOneAddress(realAddressTo);
    }
    const realAddressToLower = realAddressTo.toLowerCase();
    if (
      typeof data.transactionRemoveByFee !== 'undefined' &&
      data.transactionRemoveByFee
    ) {
      txRBF = data.transactionRemoveByFee;
      txRBFed = 'RBFremoved';
    } else if (
      typeof data.transactionReplaceByFee !== 'undefined' &&
      data.transactionReplaceByFee
    ) {
      txRBF = data.transactionReplaceByFee;
      txRBFed = 'RBFed';
    } else if (typeof data.dexOrderData !== 'undefined' && data.dexOrderData) {
      txRBFed = 'dexSend';
    } else {
      txRBFed = 'usualSend';
      if (
        realAddressTo !== '' &&
        (realAddressToLower.indexOf('0x') === -1 ||
          realAddressToLower.indexOf('0x') !== 0)
      ) {
        throw new Error('SERVER_RESPONSE_BAD_DESTINATION');
      }
    }

    let finalGasPrice = 0;
    let finalGasLimit = 0;

    let selectedFee;
    if (
      typeof uiData.selectedFee !== 'undefined' &&
      typeof uiData.selectedFee.gasPrice !== 'undefined'
    ) {
      selectedFee = uiData.selectedFee;
      // @ts-ignore
      finalGasPrice = uiData.selectedFee.gasPrice * 1;
      // @ts-ignore
      finalGasLimit = Math.ceil(uiData.selectedFee.gasLimit * 1);
    } else {
      const fees = await this.getFeeRate(data, privateData);
      if (fees.selectedFeeIndex < 0) {
        throw new Error('SERVER_RESPONSE_NOTHING_LEFT_FOR_FEE');
      }
      selectedFee = fees.fees[fees.selectedFeeIndex];
      // @ts-ignore
      finalGasPrice = selectedFee.gasPrice * 1;
      // @ts-ignoreф
      finalGasLimit = Math.ceil(selectedFee.gasLimit * 1);
    }

    if (finalGasLimit === 0 || !finalGasLimit) {
      throw new Error('SERVER_PLEASE_SELECT_FEE');
    }
    if (finalGasPrice === 0 || !finalGasPrice) {
      throw new Error('SERVER_PLEASE_SELECT_FEE');
    }

    const tx: AirDAOBlockchainTypes.EthTx = {
      chainId: '',
      from: data.addressFrom,
      to: realAddressToLower,
      gasPrice: finalGasPrice,
      gas: finalGasLimit,
      value: data.amount
    };

    if (typeof data.dexOrderData !== 'undefined' && data.dexOrderData) {
      if (typeof data.dexOrderData[0].params.data !== 'undefined') {
        tx.data = data.dexOrderData[0].params.data;
        if (typeof data.dexOrderData[0].params.value !== 'undefined') {
          tx.value = data.dexOrderData[0].params.value;
        } else {
          tx.value = 0;
        }
      }
      if (typeof data.dexOrderData[0].params.to !== 'undefined') {
        tx.to = data.dexOrderData[0].params.to;
      }
    } else if (
      typeof data.contractCallData !== 'undefined' &&
      typeof data.contractCallData.contractAddress !== 'undefined'
    ) {
      const schema = data.contractCallData.contractSchema;
      try {
        let abiCode;
        if (schema === 'ERC721') {
          abiCode = abi721.ERC721;
        } else if (schema === 'ERC1155') {
          abiCode = abi1155.ERC1155;
        } else {
          throw new Error('Contract abi not found ' + schema);
        }
        const token = new this._web3.eth.Contract(
          abiCode,
          data.contractCallData.contractAddress
        );

        const tmpParams = data.contractCallData.contractActionParams;
        for (let i = 0, ic = tmpParams.length; i < ic; i++) {
          if (tmpParams[i] === 'addressTo') {
            tmpParams[i] = realAddressTo;
          }
        }
        tx.to = data.contractCallData.contractAddress;
        tx.data = token.methods[data.contractCallData.contractAction](
          ...tmpParams
        ).encodeABI();
      } catch (e) {
        throw new Error(e.message + ' while encodeABI for ' + schema);
      }
    } else if (
      typeof data.walletConnectData !== 'undefined' &&
      typeof data.walletConnectData.data !== 'undefined'
    ) {
      tx.data = data.walletConnectData.data;
    } else if (typeof data.blockchainData !== 'undefined') {
      tx.data = data.blockchainData; // actual value for erc20 etc
    } else if (typeof data?.transactionJson?.txData !== 'undefined') {
      tx.data = data?.transactionJson?.txData;
    }

    const sender = new EthTxSendProvider(
      this._web3,
      this._trezorServerCode,
      this._mainCurrencyCode,
      this._mainChainId,
      this._settings
    );
    const logData = JSON.parse(JSON.stringify(tx));
    logData.currencyCode = this._settings.currencyCode;
    logData.selectedFee = selectedFee;
    logData.basicAddressTo =
      typeof data.basicAddressTo !== 'undefined'
        ? data.basicAddressTo.toLowerCase()
        : realAddressToLower;
    logData.basicAmount =
      typeof data.basicAmount !== 'undefined' ? data.basicAmount : data.amount;
    logData.basicToken =
      typeof data.basicToken !== 'undefined' ? data.basicToken : '';
    // logData.pushLocale = sublocale();
    logData.pushLocale = 'en';
    logData.pushSetting = await Database.localStorage.get('transactionsNotifs');

    let result = {} as AirDAOBlockchainTypes.SendTxResult;
    try {
      if (txRBF) {
        let oldNonce =
          typeof uiData.selectedFee.nonceForTx !== 'undefined'
            ? uiData.selectedFee.nonceForTx
            : false;
        if (oldNonce === false || oldNonce === -1) {
          // actually could remove as not used without receipt fee
          oldNonce =
            typeof data.transactionJson !== 'undefined' &&
            typeof data.transactionJson.nonce !== 'undefined'
              ? data.transactionJson.nonce
              : false;
        }
        if (oldNonce === false || oldNonce === -1) {
          try {
            const ethProvider = AirDAODispatcher.getScannerProcessor(
              data.currencyCode
            );
            const scannedTx = await ethProvider.getTransactionBlockchain(txRBF);
            if (scannedTx) {
              oldNonce = scannedTx.nonce;
            }
          } catch (e: any) {
            throw new Error('System error: not loaded nonce for ' + txRBF);
          }
          if (oldNonce === false || oldNonce === -1) {
            throw new Error('System error: no nonce for ' + txRBF);
          }
        }
        logData.setNonce = oldNonce;
        tx.nonce = oldNonce;
      } else {
        // @ts-ignore
        if (
          typeof uiData.selectedFee.nonceForTx !== 'undefined' &&
          (uiData.selectedFee.nonceForTx.toString() === '0' ||
            uiData.selectedFee.nonceForTx) &&
          uiData.selectedFee.nonceForTx !== '' &&
          uiData.selectedFee.nonceForTx * 1 >= 0
        ) {
          // @ts-ignore
          tx.nonce = uiData.selectedFee.nonceForTx * 1;
          logData.setNonce = tx.nonce;
          logData.selectedFee.nonceLog =
            'replacedByUi ' +
            uiData.selectedFee.nonceForTx +
            ' ' +
            (typeof logData.selectedFee.nonceLog !== 'undefined'
              ? logData.selectedFee.nonceLog
              : '');
        }
      }

      if (
        typeof uiData !== 'undefined' &&
        typeof uiData.selectedFee !== 'undefined' &&
        typeof uiData.selectedFee.rawOnly !== 'undefined' &&
        uiData.selectedFee.rawOnly
      ) {
        return {
          rawOnly: uiData.selectedFee.rawOnly,
          raw: await sender.sign(tx, privateData, txRBF, logData)
        };
      }

      try {
        result = await sender.send(tx, privateData, txRBF, logData);
      } catch (e) {
        throw e;
      }

      result.transactionFee = AirDAOUtils.mul(finalGasPrice, finalGasLimit);
      result.transactionFeeCurrencyCode =
        this._mainCurrencyCode === 'BNB' ? 'BNB_SMART' : this._mainCurrencyCode;
      if (txRBF) {
        if (
          typeof data.blockchainData === 'undefined' ||
          !data.blockchainData
        ) {
          result.amountForTx = data.amount;
        }
        result.addressTo =
          data.addressTo === data.addressFrom ||
          realAddressTo === data.addressFrom
            ? ''
            : realAddressTo;
      } else {
        result.transactionJson.txData = tx.data;
        await EthTmpDS.getCache(this._mainCurrencyCode, data.addressFrom);
      }
    } catch (e) {
      this.checkError(e, data, txRBF, logData);
    }
    // @ts-ignore
    logData.result = result;
    return result;
  }

  async setMissingTx(
    data: AirDAOBlockchainTypes.DbAccount,
    transaction: AirDAOBlockchainTypes.DbTransaction
  ): Promise<boolean> {
    if (
      typeof transaction.transactionJson !== 'undefined' &&
      transaction.transactionJson &&
      typeof transaction.transactionJson.nonce !== 'undefined'
    ) {
      await EthTmpDS.removeNonce(
        this._mainCurrencyCode,
        data.address,
        'send_' + transaction.transactionHash
      );
    }
    return true;
  }

  canRBF(
    data: AirDAOBlockchainTypes.DbAccount,
    transaction: AirDAOBlockchainTypes.DbTransaction,
    source: string
  ): boolean {
    if (transaction.transactionDirection === 'income') {
      return false;
    }
    if (typeof transaction.transactionJson !== 'undefined') {
      if (typeof transaction.transactionJson.delegatedNonce !== 'undefined') {
        return false;
      }
    }
    return true;
  }
}
