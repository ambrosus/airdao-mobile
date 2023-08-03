/**
 * @version 0.5
 * https://github.com/tronscan/tronscan-frontend/wiki/TRONSCAN-API
 */
import AirDAOCryptoLog from '../../../common/AirDAOCryptoLog';
import AirDAOAxios from '../../../common/AirDAOAxios';

const BALANCE_PATH = 'https://apilist.tronscan.org/api/account?address=';
const BALANCE_MAX_TRY = 10;

interface TronScanCache {
  [address: string]: {
    time: number;
    voteTotal?: number;
    [tokenName: string]: number | undefined;
  };
}

const CACHE_TRONSCAN: TronScanCache = {};
const CACHE_VALID_TIME = 3000; // 3 seconds

export default class TrxTronscanProvider {
  /**
   * https://apilist.tronscan.org/api/account?address=TUbHxAdhPk9ykkc7SDP5e9zUBEN14K65wk
   * @param {string} address
   * @param {string} tokenName
   * @returns {Promise<boolean|{unconfirmed: number, frozen: *, frozenEnergy: *, voteTotal: *, balance: *, provider: string}>}
   */
  async get(
    address: string,
    tokenName: string,
    useCache = true
  ): Promise<
    | boolean
    | number
    | {
        unconfirmed: number;
        frozen: number;
        frozenEnergy: number;
        voteTotal: number;
        balance: number;
        provider: string;
        time: number;
      }
  > {
    const now = new Date().getTime();
    if (
      useCache &&
      typeof CACHE_TRONSCAN[address] !== 'undefined' &&
      now - CACHE_TRONSCAN[address].time < CACHE_VALID_TIME
    ) {
      if (typeof CACHE_TRONSCAN[address][tokenName] !== 'undefined') {
        AirDAOCryptoLog.log(
          `TrxTronscanProvider.get from cache',
          ${address} +
            ' => ' +
          {tokenName} +
            ' : ' +
            ${CACHE_TRONSCAN[address][tokenName]}`
        );
        // tslint:disable-next-line:no-shadowed-variable
        const frozen: number =
          typeof CACHE_TRONSCAN[address][tokenName + 'frozen'] !== 'undefined'
            ? CACHE_TRONSCAN[address][tokenName + 'frozen']!
            : 0;
        // tslint:disable-next-line:no-shadowed-variable
        const frozenEnergy: number =
          typeof CACHE_TRONSCAN[address][tokenName + 'frozenEnergy'] !==
          'undefined'
            ? CACHE_TRONSCAN[address][tokenName + 'frozenEnergy']!
            : 0;
        // tslint:disable-next-line:no-shadowed-variable
        const voteTotal: number =
          typeof CACHE_TRONSCAN[address].voteTotal !== 'undefined'
            ? CACHE_TRONSCAN[address].voteTotal!
            : 0;
        return {
          balance: CACHE_TRONSCAN[address][tokenName]!,
          voteTotal,
          frozen,
          frozenEnergy,
          unconfirmed: 0,
          provider: 'tronscan-cache',
          time: CACHE_TRONSCAN[address].time
        };
      } else if (tokenName !== '_') {
        return false;
      }
    }

    const link = BALANCE_PATH + address;
    AirDAOCryptoLog.log('TrxTronscanProvider.get ' + link);
    const res = await AirDAOAxios.getWithoutBraking(link, BALANCE_MAX_TRY);
    // @ts-ignore
    if (!res || !('data' in res)) {
      return false;
    }

    CACHE_TRONSCAN[address] = { time: now };
    CACHE_TRONSCAN[address].time = now;
    CACHE_TRONSCAN[address]._ = res.data.balance;
    CACHE_TRONSCAN[address]._frozen =
      typeof res.data.frozen.total !== 'undefined' ? res.data.frozen.total : 0;
    CACHE_TRONSCAN[address]._frozenEnergy =
      typeof res.data.accountResource !== 'undefined' &&
      typeof res.data.accountResource.frozen_balance_for_energy !==
        'undefined' &&
      typeof res.data.accountResource.frozen_balance_for_energy
        .frozen_balance !== 'undefined'
        ? res.data.accountResource.frozen_balance_for_energy.frozen_balance
        : 0;

    CACHE_TRONSCAN[address].voteTotal =
      typeof res.data.voteTotal !== 'undefined' ? res.data.voteTotal : 0;
    let token;
    if (res.data.tokenBalances) {
      for (token of res.data.tokenBalances) {
        const id =
          typeof token.name !== 'undefined' ? token.name : token.tokenId;
        CACHE_TRONSCAN[address][id] = token.balance;
      }
    }

    if (res.data.trc20token_balances) {
      for (token of res.data.trc20token_balances) {
        const id =
          typeof token.name !== 'undefined' ? token.name : token.tokenId;
        CACHE_TRONSCAN[address][id] = token.balance;
      }
    }

    if (typeof CACHE_TRONSCAN[address][tokenName] === 'undefined') {
      if (tokenName.indexOf('T') === 0) {
        return 0;
      } else {
        return false;
      }
    }

    const balance = CACHE_TRONSCAN[address][tokenName]!;
    const frozen: number =
      typeof CACHE_TRONSCAN[address][tokenName + 'frozen'] !== 'undefined'
        ? CACHE_TRONSCAN[address][tokenName + 'frozen']!
        : 0;
    const frozenEnergy: number =
      typeof CACHE_TRONSCAN[address][tokenName + 'frozenEnergy'] !== 'undefined'
        ? CACHE_TRONSCAN[address][tokenName + 'frozenEnergy']!
        : 0;
    const voteTotal: number =
      typeof CACHE_TRONSCAN[address].voteTotal !== 'undefined'
        ? CACHE_TRONSCAN[address].voteTotal!
        : 0;
    return {
      balance,
      frozen,
      frozenEnergy,
      voteTotal,
      unconfirmed: 0,
      provider: 'tronscan',
      time: CACHE_TRONSCAN[address].time
    };
  }
}
