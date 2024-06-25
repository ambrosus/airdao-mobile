import { Wallet, ethers } from 'ethers';
import { OutAmountGetterArgs } from '@features/swap/types/swap';
import {
  createAMBProvider,
  createRouterContract
} from '@features/swap/utils/contracts/instances';
import {
  isNativeWrapped,
  minimumAmountOut,
  multiRouteAddresses,
  wrapNativeAddress
} from '@features/swap/utils';
import { ERC20_TRADE } from '@features/swap/lib/abi';
import { formatEther } from 'ethers/lib/utils';

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
  signer: Wallet,
  slippageTolerance: string,
  deadline: string
) {
  try {
    const routerContract = createRouterContract(signer, ERC20_TRADE);
    const bnAmountToSell = ethers.utils.parseEther(amountToSell);
    const timestampDeadline =
      Math.floor(Date.now() / 1000) + 60 * Number(deadline);

    const bnAmountToReceive = await getAmountsOut({
      amountToSell: bnAmountToSell,
      path
    });

    const bnMinimumReceivedAmount = minimumAmountOut(
      `${slippageTolerance}%`,
      bnAmountToReceive
    );

    const tx = await routerContract.swapExactETHForTokens(
      bnMinimumReceivedAmount,
      path,
      signer.address,
      timestampDeadline,
      { value: bnAmountToSell }
    );

    return await tx.wait();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function swapMultiHopExactTokensForTokens(
  amountToSell: string,
  path: [string, string],
  signer: Wallet,
  slippageTolerance: string,
  deadline: string
) {
  const [addressFrom, addressTo] = path;
  const bnAmountToSell = ethers.utils.parseEther(amountToSell);

  const bnIntermediateAmountToReceive = await getAmountsOut({
    amountToSell: bnAmountToSell,
    path: [addressFrom, multiRouteAddresses.SAMB]
  });

  const intermediateSwapResult = await swapExactTokensForETH(
    amountToSell,
    [addressFrom, multiRouteAddresses.SAMB],
    signer,
    slippageTolerance,
    deadline
  );

  if (intermediateSwapResult) {
    return await swapExactETHForTokens(
      formatEther(bnIntermediateAmountToReceive),
      [multiRouteAddresses.SAMB, addressTo],
      signer,
      slippageTolerance,
      deadline
    );
  }
}

export async function swapExactTokensForTokens(
  amountToSell: string,
  path: [string, string],
  signer: Wallet,
  slippageTolerance: string,
  deadline: string
) {
  try {
    const routerContract = createRouterContract(signer, ERC20_TRADE);
    const bnAmountToSell = ethers.utils.parseEther(amountToSell);
    const timestampDeadline =
      Math.floor(Date.now() / 1000) + 60 * Number(deadline);

    const bnAmountToReceive = await getAmountsOut({
      amountToSell: bnAmountToSell,
      path
    });

    const bnMinimumReceivedAmount = minimumAmountOut(
      `${slippageTolerance}%`,
      bnAmountToReceive
    );

    const tx = await routerContract.swapExactTokensForTokens(
      bnAmountToSell,
      bnMinimumReceivedAmount,
      path,
      signer.address,
      timestampDeadline
    );

    return await tx.wait();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function swapExactTokensForETH(
  amountToSell: string,
  path: [string, string],
  signer: Wallet,
  slippageTolerance: string,
  deadline: string
) {
  try {
    const routerContract = createRouterContract(signer, ERC20_TRADE);
    const bnAmountToSell = ethers.utils.parseEther(amountToSell);
    const timestampDeadline =
      Math.floor(Date.now() / 1000) + 60 * Number(deadline);

    const bnAmountToReceive = await getAmountsOut({
      amountToSell: bnAmountToSell,
      path
    });

    const bnMinimumReceivedAmount = minimumAmountOut(
      `${slippageTolerance}%`,
      bnAmountToReceive
    );

    const tx = await routerContract.swapExactTokensForETH(
      bnAmountToSell,
      bnMinimumReceivedAmount,
      path,
      signer.address,
      timestampDeadline
    );

    return await tx.wait();
  } catch (error) {
    console.error(error);
    throw error;
  }
}
