import * as Updates from 'expo-updates';

export enum Environments {
  PRODUCTION = 'prod',
  STAGE = 'testnet',
  TESTNET = 'stage'
}
export const isProd = Updates.channel === Environments.PRODUCTION;
export const isTestnet = Updates.channel === Environments.TESTNET;
export const isStage = Updates.channel === Environments.STAGE;
