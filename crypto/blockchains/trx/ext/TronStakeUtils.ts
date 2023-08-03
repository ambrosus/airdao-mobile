import BlocksoftExternalSettings from '@crypto/common/AirDAOExternalSettings';
import BlocksoftPrettyNumbers from '@crypto/common/AirDAOPrettyNumbers';
import BlocksoftBalances from '@crypto/actions/BlocksoftBalances/BlocksoftBalances';
import TronUtils from '@crypto/blockchains/trx/ext/TronUtils';

import BlocksoftAxios from '@crypto/common/BlocksoftAxios';
import Log from '@app/services/Log/Log';
import { BlocksoftTransfer } from '@crypto/actions/BlocksoftTransfer/BlocksoftTransfer';
import BlocksoftCryptoLog from '@crypto/common/BlocksoftCryptoLog';

interface Balance {
  balanceAvailable: number;
  frozen: number;
  frozenOthers: number;
  frozenEnergy: number;
  frozenEnergyOthers: number;
  frozenExpireTime: number;
  frozenEnergyExpireTime: number;
  prettyBalanceAvailable: string;
  prettyFrozen: string;
  prettyFrozenOthers: string;
  prettyFrozenEnergy: string;
  prettyFrozenEnergyOthers: string;
  prettyVote: string;
  diffLastStakeMinutes: number;
}

interface UiParams {
  walletHash: string;
  address: string;
  derivationPath: string;
  cryptoValue: number;
  type: string;
  callback: () => void;
}

const TronStakeUtils = {
  async getVoteAddresses(): Promise<string> {
    return BlocksoftExternalSettings.getStatic('TRX_VOTE_BEST');
  },

  async getPrettyBalance(address: string): Promise<Balance | false> {
    const balance = await BlocksoftBalances.setCurrencyCode('TRX')
      .setAddress(address)
      .getBalance('TronStakeUtils');
    if (!balance) {
      return false;
    }
    const prettyBalanceAvailable = BlocksoftPrettyNumbers.setCurrencyCode(
      'TRX'
    ).makePretty(balance.balanceAvailable);
    const prettyFrozen = BlocksoftPrettyNumbers.setCurrencyCode(
      'TRX'
    ).makePretty(balance.frozen);
    const prettyFrozenOthers = BlocksoftPrettyNumbers.setCurrencyCode(
      'TRX'
    ).makePretty(balance.frozenOthers);
    const prettyFrozenEnergy = BlocksoftPrettyNumbers.setCurrencyCode(
      'TRX'
    ).makePretty(balance.frozenEnergy);
    const prettyFrozenEnergyOthers = BlocksoftPrettyNumbers.setCurrencyCode(
      'TRX'
    ).makePretty(balance.frozenEnergyOthers);
    const prettyVote = (
      parseFloat(prettyFrozen) +
      parseFloat(prettyFrozenOthers) +
      parseFloat(prettyFrozenEnergy) +
      parseFloat(prettyFrozenEnergyOthers)
    )
      .toString()
      .split('.')[0];

    const maxExpire =
      balance.frozenEnergyExpireTime &&
      balance.frozenEnergyExpireTime > balance.frozenExpireTime
        ? balance.frozenEnergyExpireTime
        : balance.frozenExpireTime;
    const diffLastStakeMinutes =
      maxExpire > 0
        ? 24 * 3 * 60 - (maxExpire - new Date().getTime()) / 60000
        : -1;

    return {
      ...balance,
      prettyBalanceAvailable,
      prettyFrozen,
      prettyFrozenOthers,
      prettyFrozenEnergy,
      prettyFrozenEnergyOthers,
      prettyVote,
      diffLastStakeMinutes
    };
  },

  async sendVoteAll(
    address: string,
    derivationPath: string,
    walletHash: string,
    specialActionNeeded: string
  ): Promise<any> {
    const { prettyVote, diffLastStakeMinutes, voteTotal } =
      await TronStakeUtils.getPrettyBalance(address);
    if (
      diffLastStakeMinutes === -1 &&
      specialActionNeeded === 'vote_after_unfreeze'
    ) {
      BlocksoftCryptoLog.log(
        'TronStake.sendVoteAll ' + address + ' continue ' + diffLastStakeMinutes
      );
    } else if (!diffLastStakeMinutes || diffLastStakeMinutes < 3) {
      BlocksoftCryptoLog.log(
        'TronStake.sendVoteAll ' +
          address +
          ' skipped vote1 by ' +
          diffLastStakeMinutes
      );
      return false;
    }
    if (!prettyVote || typeof prettyVote === 'undefined') {
      BlocksoftCryptoLog.log(
        'TronStake.sendVoteAll ' + address + ' skipped vote2'
      );
      return false;
    } else if (voteTotal * 1 === parseFloat(prettyVote)) {
      if (diffLastStakeMinutes > 100) {
        BlocksoftCryptoLog.log(
          'TronStake.sendVoteAll ' +
            address +
            ' skipped vote3 ' +
            voteTotal +
            ' by ' +
            diffLastStakeMinutes
        );
        return true; // all done
      }
      BlocksoftCryptoLog.log(
        'TronStake.sendVoteAll ' + address + ' skipped vote4 ' + voteTotal
      );
      return false;
    }

    BlocksoftCryptoLog.log(
      'TronStake.sendVoteAll ' +
        address +
        ' started vote ' +
        prettyVote +
        ' by ' +
        diffLastStakeMinutes
    );

    const voteAddress = await TronStakeUtils.getVoteAddresses();
    return TronStakeUtils._send(
      '/wallet/votewitnessaccount',
      {
        owner_address: TronUtils.addressToHex(address),
        votes: [
          {
            vote_address: TronUtils.addressToHex(voteAddress),
            vote_count: parseFloat(prettyVote)
          }
        ]
      },
      'vote ' + prettyVote + ' for ' + voteAddress,
      {
        walletHash,
        address,
        derivationPath,
        type: 'vote',
        cryptoValue: BlocksoftPrettyNumbers.setCurrencyCode('TRX').makeUnPretty(
          parseFloat(prettyVote)
        ),
        callback: () => {}
      }
    );
  },

  async _send(
    shortLink: string,
    params: any,
    langMsg: string,
    uiParams: UiParams
  ): Promise<any> {
    const sendLink = BlocksoftExternalSettings.getStatic('TRX_SEND_LINK');
    const link = sendLink + shortLink;
    const tmp = await BlocksoftAxios.post(link, params);
    let blockchainData;

    if (typeof tmp.data !== 'undefined') {
      if (typeof tmp.data.raw_data_hex !== 'undefined') {
        blockchainData = tmp.data;
      } else {
        Log.log('TronStakeUtils._send no rawHex ' + link, params, tmp.data);
        throw new Error(JSON.stringify(tmp.data));
      }
    } else {
      Log.log('TronStakeUtils rawHex empty data ' + link, params);
      throw new Error('Empty data');
    }

    const txData = {
      currencyCode: 'TRX',
      walletHash: uiParams.walletHash,
      derivationPath: uiParams.derivationPath,
      addressFrom: uiParams.address,
      addressTo: '',
      blockchainData
    };

    const result = await BlocksoftTransfer.sendTx(txData, {
      selectedFee: { langMsg }
    });
    return result;
  }
};

export default TronStakeUtils;
