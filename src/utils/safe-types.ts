import { ethers } from 'ethers';
import { Token } from '@models';

export type TToken = Omit<Token, 'deriveNameAndSymbolFromDto'>;

export function _balanceSafeTypeHandler(
  balance: ethers.BigNumber | string
): balance is ethers.BigNumber {
  return typeof balance === 'object' && !('_hex' in balance);
}
