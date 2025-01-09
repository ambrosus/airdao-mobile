import { Wallet, ethers } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import { ERC20, TRADE } from '@features/swap/lib/abi';
import {
  InAmountGetterArgs,
  OutAmountGetterArgs
} from '@features/swap/types/swap';
import {
  isNativeWrapped,
  minimumAmountOut,
  addresses,
  wrapNativeAddress,
  getTimestampDeadline,
  withMultiHopPath,
  dexValidators,
  maximumAmountIn
} from '@features/swap/utils';
import {
  createAMBProvider,
  createRouterContract
} from '@features/swap/utils/contracts/instances';

async function swapArgsCallback(
  amountIn: string,
  amountOut: string,
  path: string[],
  address: string,
  timestamp: number,
  slippageTolerance: number,
  tradeIn: boolean
) {
  const bnAmountIn = ethers.utils.parseEther(amountIn);
  const bnAmountOut = ethers.utils.parseEther(amountOut);

  const [, bnAmountToReceive] = await getAmountsOut({
    amountToSell: bnAmountIn,
    path
  });

  const [bnAmountToSell] = await getAmountsIn({
    amountToReceive: bnAmountToReceive,
    path
  });

  const amountOutMin = minimumAmountOut(
    `${slippageTolerance}%`,
    bnAmountToReceive
  );

  const amountOutMax = maximumAmountIn(`${slippageTolerance}%`, bnAmountToSell);

  return [
    tradeIn ? bnAmountIn : bnAmountOut,
    tradeIn ? amountOutMin : amountOutMax,
    path,
    address,
    timestamp
  ];
}

export async function getAmountsOut({
  amountToSell,
  path
}: OutAmountGetterArgs) {
  if (dexValidators.isEmptyAmount(formatEther(amountToSell))) return;

  try {
    const provider = createAMBProvider();
    const excludeNativeETH = wrapNativeAddress(path);
    const isSelectedSameTokens = isNativeWrapped(excludeNativeETH);

    if (isSelectedSameTokens) return [amountToSell];

    const contract = createRouterContract(provider, TRADE);
    return await contract.getAmountsOut(amountToSell, excludeNativeETH);
  } catch (error) {
    throw error;
  }
}

export async function getAmountsIn({
  amountToReceive,
  path
}: InAmountGetterArgs) {
  if (dexValidators.isEmptyAmount(formatEther(amountToReceive))) return;

  try {
    const provider = createAMBProvider();
    const excludeNativeETH = wrapNativeAddress(path);
    const isSelectedSameTokens = isNativeWrapped(excludeNativeETH);

    if (isSelectedSameTokens) return [amountToReceive];

    const contract = createRouterContract(provider, TRADE);
    return await contract.getAmountsIn(amountToReceive, excludeNativeETH);
  } catch (error) {
    throw error;
  }
}

export async function swapExactETHForTokens(
  amountToSell: string,
  path: string[],
  signer: Wallet,
  slippageTolerance: number,
  deadline: string,
  tradeIn: boolean
) {
  try {
    const routerContract = createRouterContract(signer, TRADE);
    const bnAmountToSell = ethers.utils.parseEther(amountToSell);
    const timestampDeadline = getTimestampDeadline(deadline);

    const [, bnAmountToReceive] = await getAmountsOut({
      amountToSell: bnAmountToSell,
      path
    });

    const bnMinimumReceivedAmount = minimumAmountOut(
      `${slippageTolerance}%`,
      bnAmountToReceive
    );

    const callSwapMethod =
      routerContract[
        tradeIn
          ? 'swapExactAMBForTokensSupportingFeeOnTransferTokens'
          : 'swapAMBForExactTokens'
      ];

    const tx = await callSwapMethod(
      bnMinimumReceivedAmount,
      path,
      signer.address,
      timestampDeadline,
      { value: bnAmountToSell }
    );

    return await tx.wait();
  } catch (error) {
    throw error;
  }
}

export async function swapMultiHopExactTokensForTokens(
  amountToSell: string,
  path: string[],
  signer: Wallet,
  slippageTolerance: number,
  deadline: string,
  tradeIn: boolean
) {
  try {
    const routerContract = createRouterContract(signer, TRADE);
    const bnAmountToSell = ethers.utils.parseEther(amountToSell);
    const timestampDeadline = getTimestampDeadline(deadline);
    const _path = withMultiHopPath(path);

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
      const callSwapMethod =
        routerContract[
          tradeIn
            ? 'swapExactAMBForTokensSupportingFeeOnTransferTokens'
            : 'swapAMBForExactTokens'
        ];

      tx = await callSwapMethod(
        bnMinimumReceivedAmount,
        _path,
        signer.address,
        timestampDeadline,
        { value: bnAmountToSell }
      );
    } else if (isToETH) {
      const callSwapMethod =
        routerContract[
          tradeIn
            ? 'swapExactTokensForAMBSupportingFeeOnTransferTokens'
            : 'swapTokensForExactAMB'
        ];

      tx = await callSwapMethod(
        bnAmountToSell,
        bnMinimumReceivedAmount,
        _path,
        signer.address,
        timestampDeadline
      );
    } else {
      const callSwapMethod =
        routerContract[
          tradeIn
            ? 'swapExactTokensForTokensSupportingFeeOnTransferTokens'
            : 'swapTokensForExactTokens'
        ];

      tx = await callSwapMethod(
        bnAmountToSell,
        bnMinimumReceivedAmount,
        _path,
        signer.address,
        timestampDeadline
      );
    }

    return await tx.wait();
  } catch (error) {
    throw error;
  }
}

export async function swapExactTokensForTokens(
  amountIn: string,
  amountOut: string,
  path: string[],
  signer: Wallet,
  slippageTolerance: number,
  deadline: string,
  tradeIn: boolean
) {
  try {
    const routerContract = createRouterContract(signer, TRADE);
    const timestampDeadline = getTimestampDeadline(deadline);

    const callSwapMethod =
      routerContract[
        tradeIn
          ? 'swapExactTokensForTokensSupportingFeeOnTransferTokens'
          : 'swapTokensForExactTokens'
      ];

    const args = await swapArgsCallback(
      amountIn,
      amountOut,
      path,
      signer.address,
      timestampDeadline,
      slippageTolerance,
      tradeIn
    );

    const tx = await callSwapMethod(...args);

    return await tx.wait();
  } catch (error) {
    throw error;
  }
}

export async function swapExactTokensForETH(
  amountToSell: string,
  path: string[],
  signer: Wallet,
  slippageTolerance: number,
  deadline: string,
  tradeIn: boolean
) {
  try {
    const routerContract = createRouterContract(signer, TRADE);
    const bnAmountToSell = ethers.utils.parseEther(amountToSell);
    const timestampDeadline = getTimestampDeadline(deadline);

    const [, bnAmountToReceive] = await getAmountsOut({
      amountToSell: bnAmountToSell,
      path
    });

    const bnMinimumReceivedAmount = minimumAmountOut(
      `${slippageTolerance}%`,
      bnAmountToReceive
    );

    const callSwapMethod =
      routerContract[
        tradeIn
          ? 'swapExactTokensForAMBSupportingFeeOnTransferTokens'
          : 'swapTokensForExactAMB'
      ];

    const tx = await callSwapMethod(
      bnAmountToSell,
      bnMinimumReceivedAmount,
      path,
      signer.address,
      timestampDeadline
    );

    return await tx.wait();
  } catch (error) {
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
