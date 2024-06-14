import Config from '@constants/config';

export const environment =
  Config.env === 'testnet' ? 'testnet' : 'prod' || 'testnet';
