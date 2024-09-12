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
  extractArrayOfMiddleMultiHopAddresses
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
  const bnAmountToSell = ethers.utils.parseEther(amountToSell);
  const [addressFrom, addressTo] = path;

  const excludeNativeETH = wrapNativeAddress(path);
  const middleAddress = extractArrayOfMiddleMultiHopAddresses(path).address;

  const intermediateSwapFunction = getSwapFunction(addressFrom, middleAddress);
  const finalSwapFunction = getSwapFunction(middleAddress, addressTo);

  const wrappedETHAddress =
    middleAddress === ethers.constants.AddressZero
      ? addresses.SAMB
      : middleAddress;

  if (!intermediateSwapFunction || !finalSwapFunction) {
    throw new Error('Invalid path configuration');
  }

  const intermediateSwapResult = await intermediateSwapFunction(
    amountToSell,
    [excludeNativeETH[0], wrappedETHAddress],
    signer,
    slippageTolerance,
    deadline
  );

  const [, bnIntermediateAmountToReceive] = await getAmountsOut({
    amountToSell: bnAmountToSell,
    path: [excludeNativeETH[0], middleAddress]
  });

  if (intermediateSwapResult) {
    return await finalSwapFunction(
      formatEther(bnIntermediateAmountToReceive),
      [wrappedETHAddress, excludeNativeETH[1]],
      signer,
      slippageTolerance,
      deadline
    );
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

function getSwapFunction(fromAddress: string, toAddress: string) {
  const isFromAMB = fromAddress === addresses.AMB;
  const isToAMB = toAddress === addresses.AMB;

  if (isFromAMB || isToAMB) {
    return isFromAMB ? swapExactETHForTokens : swapExactTokensForETH;
  } else {
    return swapExactTokensForTokens;
  }
}
