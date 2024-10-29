/* eslint-disable camelcase */
import { DatabaseTable, WalletMetadata } from '@appTypes';
import { Database, WalletDBModel } from '@database';

export class Wallet {
  name: string;
  address: string;
  hash: string;
  number: number;
  cashback: string;
  isBackedUp: number;
  isHideTransactionForFee: number;
  allowReplaceByFee: number;
  useLegacy: number;
  useUnconfirmed: number;
  isHd: number;
  isCreatedHere: number;
  toSendStatus: number;

  constructor(details: WalletMetadata) {
    this.hash = details.hash || 'empty_hash';
    this.address = details.address;
    this.name = details.name;
    this.number = details.number;
    this.cashback = details.cashback || 'empty_cashback';
    this.isBackedUp = details.isBackedUp || 0;
    this.isHideTransactionForFee = details.isHideTransactionForFee || 1;
    this.allowReplaceByFee = details.allowReplaceByFee || 1;
    this.useLegacy = details.useLegacy || 2;
    this.useUnconfirmed = details.useUnconfirmed || 1;
    this.isHd = details.isHd || 0;
    this.isCreatedHere = details.isCreatedHere || 0;
    this.toSendStatus = details.toSendStatus || 0;
  }

  static async saveWallet(wallet: WalletMetadata) {
    return await Database.createModel(DatabaseTable.Wallets, wallet);
  }

  static fromDBModel(model: WalletDBModel): Wallet {
    return new Wallet({
      address: model.address,
      name: model.name,
      hash: model.hash,
      number: model.number,
      cashback: model.cashback,
      isBackedUp: model.isBackedUp,
      isHideTransactionForFee: model.isHideTransactionForFee,
      allowReplaceByFee: model.allowReplaceByFee,
      useLegacy: model.useLegacy,
      useUnconfirmed: model.useUnconfirmed,
      isHd: model.isHd,
      isCreatedHere: model.isCreatedHere,
      toSendStatus: model.toSendStatus
    });
  }
}
