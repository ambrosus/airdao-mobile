import { Wallet, ethers } from 'ethers';
import {
  InAmountGetterArgs,
  OutAmountGetterArgs
} from '@features/swap/types/swap';
import {
  createAMBProvider,
  createRouterContract
} from '@features/swap/utils/contracts/instances';
import { formatEther } from 'ethers/lib/utils';
import {
  isNativeWrapped,
  minimumAmountOut,
  addresses,
  wrapNativeAddress,
  pushMiddleAddressToPath
} from '@features/swap/utils';
import { ERC20, TRADE } from '@features/swap/lib/abi';

export async function getAmountsOut({
  amountToSell,
  path
}: OutAmountGetterArgs) {
  if (formatEther(amountToSell) === '') return;

  try {
    const provider = createAMBProvider();
    const excludeNativeETH = wrapNativeAddress(path);
    const isSelectedSameTokens = isNativeWrapped(excludeNativeETH);

    if (isSelectedSameTokens) return [amountToSell];

    const contract = createRouterContract(provider, TRADE);
    return await contract.getAmountsOut(amountToSell, excludeNativeETH);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getAmountsIn({
  amountToReceive,
  path
}: InAmountGetterArgs) {
  if (formatEther(amountToReceive) === '') return;

  try {
    const provider = createAMBProvider();
    const excludeNativeETH = wrapNativeAddress(path);
    const isSelectedSameTokens = isNativeWrapped(excludeNativeETH);

    if (isSelectedSameTokens) return [amountToReceive];

    const contract = createRouterContract(provider, TRADE);
    return await contract.getAmountsIn(amountToReceive, excludeNativeETH);
  } catch (error) {
    console.error(error, 'ERROR');
    throw error;
  }
}

export async function swapExactETHForTokens(
  amountToSell: string,
  path: string[],
  signer: Wallet,
  slippageTolerance: string,
  deadline: string
) {
  try {
    const routerContract = createRouterContract(signer, TRADE);
    const bnAmountToSell = ethers.utils.parseEther(amountToSell);
    const timestampDeadline =
      Math.floor(Date.now() / 1000) + 60 * Number(deadline);

    const [, bnAmountToReceive] = await getAmountsOut({
      amountToSell: bnAmountToSell,
      path
    });

    const bnMinimumReceivedAmount = minimumAmountOut(
      `${slippageTolerance}%`,
      bnAmountToReceive
    );

    const tx = await routerContract.swapExactAMBForTokens(
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
  path: string[],
  signer: Wallet,
  slippageTolerance: string,
  deadline: string
) {
  try {
    const routerContract = createRouterContract(signer, TRADE);
    const bnAmountToSell = ethers.utils.parseEther(amountToSell);
    const timestampDeadline =
      Math.floor(Date.now() / 1000) + 60 * Number(deadline);

    const _path = pushMiddleAddressToPath(path);

    const bnAmountToReceiveArray = await getAmountsOut({
      amountToSell: bnAmountToSell,
      path: _path
    });

    const bnAmountToReceive =
      bnAmountToReceiveArray[bnAmountToReceiveArray.length - 1];

    const bnMinimumReceivedAmount = minimumAmountOut(
      `${slippageTolerance}%`,
      bnAmountToReceive
    );

    if (_path.length < 3) {
      throw new Error('Path must contain 2 or 3 addresses');
    }

    const isFromETH = path[0] === addresses.AMB;
    const isToETH = path[path.length - 1] === addresses.AMB;

    let tx;

    if (isFromETH) {
      tx = await routerContract.swapExactAMBForTokens(
        bnMinimumReceivedAmount,
        _path,
        signer.address,
        timestampDeadline,
        { value: bnAmountToSell }
      );
    } else if (isToETH) {
      tx = await routerContract.swapExactTokensForAMB(
        bnAmountToSell,
        bnMinimumReceivedAmount,
        _path,
        signer.address,
        timestampDeadline
      );
    } else {
      tx = await routerContract.swapExactTokensForTokens(
        bnAmountToSell,
        bnMinimumReceivedAmount,
        _path,
        signer.address,
        timestampDeadline
      );
    }

    return await tx.wait();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function swapExactTokensForTokens(
  amountToSell: string,
  path: string[],
  signer: Wallet,
  slippageTolerance: string,
  deadline: string
) {
  try {
    const routerContract = createRouterContract(signer, TRADE);
    const bnAmountToSell = ethers.utils.parseEther(amountToSell);
    const timestampDeadline =
      Math.floor(Date.now() / 1000) + 60 * Number(deadline);

    const [, bnAmountToReceive] = await getAmountsOut({
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
  path: string[],
  signer: Wallet,
  slippageTolerance: string,
  deadline: string
) {
  try {
    const routerContract = createRouterContract(signer, TRADE);
    const bnAmountToSell = ethers.utils.parseEther(amountToSell);
    const timestampDeadline =
      Math.floor(Date.now() / 1000) + 60 * Number(deadline);

    const [, bnAmountToReceive] = await getAmountsOut({
      amountToSell: bnAmountToSell,
      path
    });

    const bnMinimumReceivedAmount = minimumAmountOut(
      `${slippageTolerance}%`,
      bnAmountToReceive
    );

    const tx = await routerContract.swapExactTokensForAMB(
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

export async function wrapETH(amountToSell: string, signer: Wallet) {
  const bnAmountToSell = ethers.utils.parseEther(amountToSell);
  const contract = new ethers.Contract(addresses.SAMB, ERC20);

  const signedContract = contract.connect(signer);
  const tx = await signedContract.deposit({ value: bnAmountToSell });

  return await tx.wait();
}

export async function unwrapETH(amountToSell: string, signer: Wallet) {
  const bnAmountToSell = ethers.utils.parseEther(amountToSell);
  const contract = new ethers.Contract(addresses.SAMB, ERC20);

  const signedContract = contract.connect(signer);
  const tx = await signedContract.withdraw(bnAmountToSell);

  return await tx.wait();
}
