import { Wallet, ethers } from 'ethers';
import { OutAmountGetterArgs } from '@features/swap/types/swap';
import {
  createAMBProvider,
  createRouterContract
} from '@features/swap/utils/contracts/instances';
import {
  isNativeWrapped,
  minimumAmountOut,
  wrapNativeAddress
} from '@features/swap/utils';
import { ERC20_TRADE } from '@features/swap/lib/abi';

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

    const contract = createRouterContract(provider, ERC20_TRADE);

    const [, amountToReceive] = await contract.getAmountsOut(
      amountToSell,
      excludeNativeETH
    );

    return amountToReceive;
  } catch (error) {
    throw error;
  }
}

export async function swapExactETHForTokens(
  amountToSell: string,
  path: [string, string],
  signer: Wallet
) {
  try {
    const routerContract = createRouterContract(signer, ERC20_TRADE);
    const bnAmountToSell = ethers.utils.parseEther(amountToSell);
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

    const bnAmountToReceive = await getAmountsOut({
      amountToSell: bnAmountToSell,
      path
    });

    const bnMinimumReceivedAmount = minimumAmountOut(`0.5%`, bnAmountToReceive);

    const tx = await routerContract.swapExactETHForTokens(
      bnMinimumReceivedAmount,
      path,
      // [multiRouteAddresses.SAMB, multiRouteAddresses.USDC],
      signer.address,
      deadline,
      { value: bnAmountToSell }
    );

    const result = await tx.wait();
    // console.log('swapExactETHForTokens', result);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function swapExactTokensForTokens(
  amountToSell: string,
  path: [string, string],
  signer: Wallet
) {
  try {
    const routerContract = createRouterContract(signer, ERC20_TRADE);
    const bnAmountToSell = ethers.utils.parseEther(amountToSell);
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

    const bnAmountToReceive = await getAmountsOut({
      amountToSell: bnAmountToSell,
      path
    });

    const bnMinimumReceivedAmount = minimumAmountOut(`0.5%`, bnAmountToReceive);

    const tx = await routerContract.swapExactTokensForTokens(
      bnAmountToSell,
      bnMinimumReceivedAmount,
      path,
      signer.address,
      deadline
    );

    const result = await tx.wait();
    // console.log('swapExactTokensForTokens', result);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function swapExactTokensForETH(
  amountToSell: string,
  path: [string, string],
  signer: Wallet
) {
  try {
    const routerContract = createRouterContract(signer, ERC20_TRADE);
    const bnAmountToSell = ethers.utils.parseEther(amountToSell);
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

    const bnAmountToReceive = await getAmountsOut({
      amountToSell: bnAmountToSell,
      path
    });

    const bnMinimumReceivedAmount = minimumAmountOut(`0.5%`, bnAmountToReceive);

    const tx = await routerContract.swapExactTokensForETH(
      bnAmountToSell,
      bnMinimumReceivedAmount,
      path,
      signer.address,
      deadline
    );

    const result = await tx.wait();
    // console.log('swapExactTokensForETH', result);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
