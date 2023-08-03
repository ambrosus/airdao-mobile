/**
 * @version 0.52
 */
import BlocksoftAxios from '@crypto/common/BlocksoftAxios';
import BlocksoftExternalSettings from '@crypto/common/AirDAOExternalSettings';

import { PublicKey } from '@solana/web3.js/src';
import { Account } from '@solana/web3.js/src/account';

import BlocksoftCryptoLog from '@crypto/common/BlocksoftCryptoLog';
// @ts-ignore
import settingsActions from '@app/appstores/Stores/Settings/SettingsActions';
import config from '@constants/config';
import { AxiosResponse } from 'axios';

const TOKEN_PROGRAM_ID = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
const ASSOCIATED_TOKEN_PROGRAM_ID =
  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL';
const OWNER_VALIDATION_PROGRAM_ID =
  '4MNPdKu9wFMvEeZBMt3Eipfs5ovVWTJb31pEXDJAAxX5';

const CACHE_VALID_TIME = 12000000; // 200 minutes

const CACHE_EPOCH = {
  ts: 0,
  value: 240
};

export default {
  getTokenProgramID(): string {
    return TOKEN_PROGRAM_ID;
  },

  getOwnerValidationProgramId(): string {
    return OWNER_VALIDATION_PROGRAM_ID;
  },

  getAssociatedTokenProgramId(): string {
    return ASSOCIATED_TOKEN_PROGRAM_ID;
  },

  async findAssociatedTokenAddress(
    walletAddress: string,
    tokenMintAddress: string
  ): Promise<string> {
    try {
      const seeds = [
        new PublicKey(walletAddress).toBuffer(),
        new PublicKey(TOKEN_PROGRAM_ID).toBuffer(),
        new PublicKey(tokenMintAddress).toBuffer()
      ];
      const res = await PublicKey.findProgramAddress(
        seeds,
        new PublicKey(ASSOCIATED_TOKEN_PROGRAM_ID)
      );
      return res[0].toBase58();
    } catch (e: any) {
      if (config.debug.cryptoErrors) {
        console.log('SolUtils.findAssociatedTokenAddress ' + e.message);
      }
      throw new Error('SYSTEM_ERROR');
    }
  },

  async getAccountInfo(address: string): Promise<any> {
    let accountInfo = false;
    try {
      const apiPath = BlocksoftExternalSettings.getStatic('SOL_SERVER');
      const checkData = {
        jsonrpc: '2.0',
        id: 1,
        method: 'getAccountInfo',
        params: [
          address,
          {
            encoding: 'jsonParsed'
          }
        ]
      };
      // @ts-ignore
      const res: AxiosResponse<any, any> = await BlocksoftAxios._request(
        apiPath,
        'POST',
        checkData
      );
      accountInfo = res.data.result.value;
    } catch (e: any) {
      if (config.debug.cryptoErrors) {
        console.log(
          'SolUtils.getAccountInfo ' + address + ' error ' + e.message
        );
      }
      BlocksoftCryptoLog.log(
        'SolUtils.getAccountInfo ' + address + ' error ' + e.message
      );
    }
    return accountInfo;
  },

  isAddressValid(value: string): boolean {
    // tslint:disable-next-line:no-unused-expression
    new PublicKey(value);
    return true;
  },

  /**
   * https://docs.solana.com/developing/clients/jsonrpc-api#sendtransaction
   * @param raw
   * @returns {Promise<string>}
   */
  async sendTransaction(raw: string): Promise<string> {
    const sendData = {
      jsonrpc: '2.0',
      id: 1,
      method: 'sendTransaction',
      params: [
        raw,
        {
          encoding: 'base64'
        }
      ]
    };
    const apiPath = BlocksoftExternalSettings.getStatic('SOL_SERVER');
    const apiPath2 = BlocksoftExternalSettings.getStatic('SOL_SERVER_2');
    let try2 = false;
    let sendRes: any = null; // Initialize with 'null'
    try {
      sendRes = await BlocksoftAxios._request(apiPath, 'POST', sendData);
      if (!sendRes || typeof sendRes.data === 'undefined') {
        if (apiPath2) {
          try2 = true;
        } else {
          throw new Error('SERVER_RESPONSE_BAD_INTERNET');
        }
      }
      if (
        typeof sendRes.data.error !== 'undefined' &&
        typeof sendRes.data.error.message !== 'undefined'
      ) {
        if (sendRes.data.error.message === 'Node is unhealthy') {
          try2 = true;
        } else {
          throw new Error(sendRes.data.error.message);
        }
      }
    } catch (e) {
      try2 = true;
    }

    if (try2 && apiPath2 && apiPath2 !== apiPath) {
      let sendRes2: any = null; // Initialize with 'null'
      try {
        sendRes2 = await BlocksoftAxios._request(apiPath2, 'POST', sendData);
        if (!sendRes2 || typeof sendRes2.data === 'undefined') {
          throw new Error('SERVER_RESPONSE_BAD_INTERNET');
        }
        if (
          typeof sendRes2.data.error !== 'undefined' &&
          typeof sendRes2.data.error.message !== 'undefined'
        ) {
          throw new Error(sendRes2.data.error.message);
        }
        return sendRes2.data.result;
      } catch (e) {
        await BlocksoftCryptoLog.log(e);
      }
    }

    return sendRes?.data?.result || '';
  },

  /**
   * @returns {Promise<{blockhash: string, feeCalculator: {lamportsPerSignature: number}}>}
   */
  async getBlockData(): Promise<{
    blockhash: string;
    feeCalculator: { lamportsPerSignature: number };
  }> {
    const getRecentBlockhashData = {
      jsonrpc: '2.0',
      id: 1,
      method: 'getRecentBlockhash'
    };
    const apiPath = BlocksoftExternalSettings.getStatic('SOL_SERVER');
    const getRecentBlockhashRes = await BlocksoftAxios._request(
      apiPath,
      'POST',
      getRecentBlockhashData
    );
    // @ts-ignore
    return getRecentBlockhashRes.data.result.value;
  },

  async getEpoch(): Promise<number> {
    const now = new Date().getTime();
    if (CACHE_EPOCH.ts > 0) {
      if (now - CACHE_EPOCH.ts < CACHE_VALID_TIME) {
        return CACHE_EPOCH.value;
      }
    } else {
      const tmp = settingsActions.getSettings('SOL_epoch');
      if (tmp * 1 > CACHE_EPOCH.value) {
        CACHE_EPOCH.value = tmp * 1;
      }
    }
    const apiPath = BlocksoftExternalSettings.getStatic('SOL_SERVER');
    const getEpoch = { jsonrpc: '2.0', id: 1, method: 'getEpochInfo' };
    try {
      const resEpoch = await BlocksoftAxios._request(apiPath, 'POST', getEpoch);
      // @ts-ignore
      const tmp = resEpoch.data.result.epoch * 1;
      if (tmp > 0 && tmp !== CACHE_EPOCH.value) {
        CACHE_EPOCH.value = tmp;
        settingsActions.setSettings('SOL_epoch', tmp);
      }
      CACHE_EPOCH.ts = now;
    } catch (e: any) {
      BlocksoftCryptoLog.log('SolUtils.getEpoch error ' + e.message);
      // nothing
    }
    return CACHE_EPOCH.value;
  },

  async signTransaction(
    transaction: any,
    walletPrivKey: string,
    walletPubKey: string
  ): Promise<any> {
    let account: Account | boolean = false;
    try {
      account = new Account(Buffer.from(walletPrivKey, 'hex'));
    } catch (e: any) {
      e.message += ' while create account';
      throw e;
    }

    try {
      const data = await this.getBlockData();
      transaction.recentBlockhash = data.blockhash;
    } catch (e: any) {
      e.message += ' while getBlockData';
      throw e;
    }
    try {
      transaction.setSigners(new PublicKey(walletPubKey));
    } catch (e: any) {
      e.message += ' while setSigners';
      throw e;
    }

    try {
      transaction.partialSign(account as Account);
    } catch (e: any) {
      e.message += ' while transaction.partialSign with account';
      throw e;
    }

    return transaction;
  }
};
