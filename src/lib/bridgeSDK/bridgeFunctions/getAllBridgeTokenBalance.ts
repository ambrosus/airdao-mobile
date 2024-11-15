import { getTokenBridgeBalance } from './getTokenBridgeBalance';
import { Token } from '@lib/bridgeSDK/models/types';

export const getAllBridgeTokenBalance = async (
  pairs: Token[][],
  from: string,
  ownerAddress: string
) => {
  const _pairs = [...pairs];
  await Promise.all(
    _pairs.map(async (pair) => {
      pair[0].balance = await getTokenBridgeBalance({
        from,
        token: pair[0],
        ownerAddress
      });
    })
  );
  return _pairs;
};
