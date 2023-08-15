/**
 * @version 0.5
 * https://github.com/tronscan/tronscan-frontend/wiki/TRONSCAN-API
 */
import AirDAOCryptoLog from '../../../common/AirDAOCryptoLog';
import AirDAOAxios from '../../../common/AirDAOAxios';
import BlocksoftExternalSettings from '@crypto/common/AirDAOExternalSettings';
import TronUtils from '@crypto/blockchains/trx/ext/TronUtils';

const BALANCE_MAX_TRY = 10;

interface CacheData {
  isMultisig: boolean;
  time: number;
  [tokenName: string]: any;
}

const CACHE_TRONGRID: { [address: string]: CacheData } = {};

const CACHE_VALID_TIME = 3000; // 3 seconds

export default class TrxTrongridProvider {
  async isMultisigTrongrid(address: string): Promise<boolean> {
    if (typeof CACHE_TRONGRID[address] !== 'undefined') {
      return CACHE_TRONGRID[address].isMultisig;
    }
    const res = await this.get(address, '_', true);
    return res?.isMultisig || false;
  }

  /**
   * https://api.trongrid.io/walletsolidity/getaccount?address=41d4eead2ea047881ce54cae1a765dfe92a8bfdbe9
   * @param {string} address
   * @param {string} tokenName
   * @returns {Promise<boolean|{unconfirmed: number, frozen: *, frozenEnergy:*, voteTotal: *, balance: *, provider: string}>}
   */
  async get(
    address: string,
    tokenName: string,
    useCache = true
  ): Promise<
    | false
    | {
        isMultisig: boolean;
        balance: any;
        voteTotal: number;
        frozen?: any; // Make it optional
        frozenExpireTime?: any; // Make it optional
        frozenOthers?: any; // Make it optional
        frozenEnergy?: any; // Make it optional
        frozenEnergyExpireTime?: any; // Make it optional
        frozenEnergyOthers?: any; // Make it optional
        unconfirmed: number;
        provider: string;
        time: number;
      }
  > {
    const now = new Date().getTime();
    if (
      useCache &&
      typeof CACHE_TRONGRID[address] !== 'undefined' &&
      now - CACHE_TRONGRID[address].time < CACHE_VALID_TIME
    ) {
      if (typeof CACHE_TRONGRID[address][tokenName] !== 'undefined') {
        AirDAOCryptoLog.log(
          `TrxTrongridProvider.get from cache',
          ${address} +
            ' => ' +
            ${tokenName} +
            ' : ' +
            ${CACHE_TRONGRID[address][tokenName]}`
        );
        // tslint:disable-next-line:no-shadowed-variable
        const voteTotal =
          typeof CACHE_TRONGRID[address].voteTotal !== 'undefined'
            ? CACHE_TRONGRID[address].voteTotal
            : 0;
        // tslint:disable-next-line:no-shadowed-variable
        const frozen =
          typeof CACHE_TRONGRID[address][tokenName + 'frozen'] !== 'undefined'
            ? CACHE_TRONGRID[address][tokenName + 'frozen']
            : 0;
        // tslint:disable-next-line:no-shadowed-variable
        const frozenExpireTime =
          typeof CACHE_TRONGRID[address][tokenName + 'frozenExpireTime'] !==
          'undefined'
            ? CACHE_TRONGRID[address][tokenName + 'frozenExpireTime']
            : 0;
        // tslint:disable-next-line:no-shadowed-variable
        const frozenOthers =
          typeof CACHE_TRONGRID[address][tokenName + 'frozenOthers'] !==
          'undefined'
            ? CACHE_TRONGRID[address][tokenName + 'frozenOthers']
            : 0;
        // tslint:disable-next-line:no-shadowed-variable
        const frozenEnergy =
          typeof CACHE_TRONGRID[address][tokenName + 'frozenEnergy'] !==
          'undefined'
            ? CACHE_TRONGRID[address][tokenName + 'frozenEnergy']
            : 0;
        // tslint:disable-next-line:no-shadowed-variable
        const frozenEnergyExpireTime =
          typeof CACHE_TRONGRID[address][
            tokenName + 'frozenEnergyExpireTime'
          ] !== 'undefined'
            ? CACHE_TRONGRID[address][tokenName + 'frozenEnergyExpireTime']
            : 0;
        // tslint:disable-next-line:no-shadowed-variable
        const frozenEnergyOthers =
          typeof CACHE_TRONGRID[address][tokenName + 'frozenEnergyOthers'] !==
          'undefined'
            ? CACHE_TRONGRID[address][tokenName + 'frozenEnergyOthers']
            : 0;
        return {
          isMultisig: CACHE_TRONGRID[address].isMultisig,
          balance: CACHE_TRONGRID[address][tokenName],
          voteTotal,
          frozen,
          frozenExpireTime,
          frozenOthers,
          frozenEnergy,
          frozenEnergyExpireTime,
          frozenEnergyOthers,
          unconfirmed: 0,
          provider: 'trongrid-cache',
          time: CACHE_TRONGRID[address].time
        };
      } else if (tokenName !== '_') {
        return false;
      }
    }

    const nodeLink = BlocksoftExternalSettings.getStatic('TRX_SOLIDITY_NODE');
    const link = nodeLink + '/walletsolidity/getaccount';
    const params = { address };
    AirDAOCryptoLog.log(
      'TrxTrongridProvider.get ' + link + ' ' + JSON.stringify(params)
    );
    const res: { data: any } = await AirDAOAxios.postWithoutBraking(
      link,
      params,
      BALANCE_MAX_TRY
    );
    if (!res || !res.data) {
      return false;
    }

    let isMultisig = false;
    if (res.data.active_permission) {
      for (const perm of res.data.active_permission) {
        if (perm.keys[0].address !== address) {
          isMultisig = TronUtils.addressHexToStr(perm.keys[0].address);
        }
      }
    }

    CACHE_TRONGRID[address] = {
      isMultisig,
      time: now
    };
    CACHE_TRONGRID[address]._ =
      typeof res.data.balance !== 'undefined' ? res.data.balance : 0;
    CACHE_TRONGRID[address]._frozen =
      typeof res.data.frozen !== 'undefined' &&
      typeof res.data.frozen[0] !== 'undefined'
        ? res.data.frozen[0].frozen_balance
        : 0;
    CACHE_TRONGRID[address]._frozenExpireTime =
      typeof res.data.frozen !== 'undefined' &&
      typeof res.data.frozen[0] !== 'undefined'
        ? res.data.frozen[0].expire_time
        : 0;
    CACHE_TRONGRID[address]._frozenOthers =
      typeof res.data.delegated_frozen_balance_for_bandwidth !== 'undefined'
        ? res.data.delegated_frozen_balance_for_bandwidth
        : 0;
    CACHE_TRONGRID[address]._frozenEnergy =
      typeof res.data.account_resource !== 'undefined' &&
      typeof res.data.account_resource.frozen_balance_for_energy !==
        'undefined' &&
      typeof res.data.account_resource.frozen_balance_for_energy
        .frozen_balance !== 'undefined'
        ? res.data.account_resource.frozen_balance_for_energy.frozen_balance
        : 0;
    CACHE_TRONGRID[address]._frozenEnergyExpireTime =
      typeof res.data.account_resource !== 'undefined' &&
      typeof res.data.account_resource.frozen_balance_for_energy !==
        'undefined' &&
      typeof res.data.account_resource.frozen_balance_for_energy.expire_time !==
        'undefined'
        ? res.data.account_resource.frozen_balance_for_energy.expire_time
        : 0;

    CACHE_TRONGRID[address]._frozenEnergyOthers = 0;
    if (
      typeof res.data.account_resource !== 'undefined' &&
      typeof res.data.account_resource.delegated_frozen_balance_for_energy !==
        'undefined' &&
      res.data.account_resource.delegated_frozen_balance_for_energy * 1 > 0
    ) {
      CACHE_TRONGRID[address]._frozenEnergyOthers =
        res.data.account_resource.delegated_frozen_balance_for_energy * 1;
    }
    CACHE_TRONGRID[address].voteTotal =
      typeof res.data.votes !== 'undefined' &&
      typeof res.data.votes[0] !== 'undefined'
        ? res.data.votes[0].vote_count
        : 0;

    if (res.data.assetV2) {
      let token;
      for (token of res.data.assetV2) {
        CACHE_TRONGRID[address][token.key] = token.value;
      }
    }

    if (typeof CACHE_TRONGRID[address][tokenName] === 'undefined') {
      return false;
    }

    const balance = CACHE_TRONGRID[address][tokenName];
    const frozen =
      typeof CACHE_TRONGRID[address][tokenName + 'frozen'] !== 'undefined'
        ? CACHE_TRONGRID[address][tokenName + 'frozen']
        : 0;
    const frozenExpireTime =
      typeof CACHE_TRONGRID[address][tokenName + 'frozenExpireTime'] !==
      'undefined'
        ? CACHE_TRONGRID[address][tokenName + 'frozenExpireTime']
        : 0;
    const frozenOthers =
      typeof CACHE_TRONGRID[address][tokenName + 'frozenOthers'] !== 'undefined'
        ? CACHE_TRONGRID[address][tokenName + 'frozenOthers']
        : 0;
    const frozenEnergy =
      typeof CACHE_TRONGRID[address][tokenName + 'frozenEnergy'] !== 'undefined'
        ? CACHE_TRONGRID[address][tokenName + 'frozenEnergy']
        : 0;
    const frozenEnergyExpireTime =
      typeof CACHE_TRONGRID[address][tokenName + 'frozenEnergyExpireTime'] !==
      'undefined'
        ? CACHE_TRONGRID[address][tokenName + 'frozenEnergyExpireTime']
        : 0;
    const frozenEnergyOthers =
      typeof CACHE_TRONGRID[address][tokenName + 'frozenEnergy'] !== 'undefined'
        ? CACHE_TRONGRID[address][tokenName + 'frozenEnergyOthers']
        : 0;
    const voteTotal =
      typeof CACHE_TRONGRID[address].voteTotal !== 'undefined'
        ? CACHE_TRONGRID[address].voteTotal
        : 0;
    return {
      isMultisig: CACHE_TRONGRID[address].isMultisig,
      balance,
      voteTotal,
      frozen,
      frozenExpireTime,
      frozenOthers,
      frozenEnergy,
      frozenEnergyExpireTime,
      frozenEnergyOthers,
      unconfirmed: 0,
      provider: 'trongrid ' + nodeLink,
      time: CACHE_TRONGRID[address].time
    };
  }

  async getResources(address: string): Promise<{
    leftBand: any;
    totalBand: any;
    leftEnergy: any;
    totalEnergy: any;
  }> {
    const sendLink = BlocksoftExternalSettings.getStatic('TRX_SEND_LINK');
    const link = sendLink + '/wallet/getaccountresource';
    let leftBand: any = false;
    let totalBand: any = false;
    let leftEnergy: any = false;
    let totalEnergy: any = false;
    try {
      const res: { data: any } = await AirDAOAxios.post(link, { address });
      if (!res || typeof res.data !== 'object') {
        throw new Error('Invalid response from Trongrid');
      }
      const tronData = res.data;
      delete tronData.assetNetUsed;
      delete tronData.assetNetLimit;
      await AirDAOCryptoLog.log(
        'TrxTrongridProvider.assets result ' + link + ' from ' + address,
        tronData
      );
      totalBand =
        typeof tronData.freeNetLimit !== 'undefined' && tronData.freeNetLimit
          ? tronData.freeNetLimit
          : 0;
      if (
        typeof tronData.NetLimit !== 'undefined' &&
        tronData.NetLimit &&
        tronData.NetLimit * 1 > 0
      ) {
        totalBand = totalBand * 1 + tronData.NetLimit * 1;
      }

      leftBand = totalBand;
      if (typeof tronData.freeNetUsed !== 'undefined' && tronData.freeNetUsed) {
        leftBand = leftBand - tronData.freeNetUsed * 1;
      }
      if (typeof tronData.NetUsed !== 'undefined' && tronData.NetUsed) {
        leftBand = leftBand - tronData.NetUsed * 1;
      }

      totalEnergy =
        typeof tronData.EnergyLimit !== 'undefined' && tronData.EnergyLimit
          ? tronData.EnergyLimit
          : 0;
      leftEnergy = totalEnergy;
      if (typeof tronData.EnergyUsed !== 'undefined' && tronData.EnergyUsed) {
        leftEnergy = leftEnergy - tronData.EnergyUsed * 1;
      }
    } catch (e) {
      console.log(e);
    }
    return {
      leftBand,
      totalBand,
      leftEnergy,
      totalEnergy
    };
  }
}