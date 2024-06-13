import Config from '@constants/config';
import { OutAmountGetterArgs } from '@features/swap/types/swap';
import { createAMBProvider } from '@features/swap/utils/contracts/instances';
import {
  isNativeWrapped,
  wrapNativeAddress
} from '@features/swap/utils/wrap-native-address';
import { ethers } from 'ethers';
import { ERC20_TRADE } from '../abi';

export async function getAmountsOut({
  amountToSell,
  path
}: OutAmountGetterArgs) {
  try {
    const provider = createAMBProvider();

    const excludeNativeETH = wrapNativeAddress(path);
    const isSelectedSameTokens = isNativeWrapped(excludeNativeETH);

    if (isSelectedSameTokens) {
      return amountToSell;
    }

    const contract = new ethers.Contract(
      Config.ROUTER_V2_ADDRESS,
      ERC20_TRADE,
      provider
    );

    const [, amountToReceive] = await contract.getAmountsOut(
      amountToSell,
      excludeNativeETH
    );

    return amountToReceive;
  } catch (error) {
    throw error;
  }
}
