import { FeeData, RelayUrls, RunWithdrawModel, Token } from '../models/types';
import { BigNumber, BigNumberish, ethers } from 'ethers';
import { erc20Contract } from '../abi/sdkABI';

export async function getFeeData(
  tokenFrom: Token,
  tokenTo: Token,
  amountTokens: string,
  isMax: boolean,
  relayUrls: RelayUrls
): Promise<FeeData> {
  const relayUrl = relayUrls[tokenFrom.bridgeNetwork];

  const amountForFee = getAmountInForeignDecimals(
    tokenFrom,
    tokenTo,
    amountTokens
  );

  const body = {
    tokenAddress: tokenFrom.isNativeCoin
      ? ethers.constants.AddressZero
      : tokenFrom.address,
    isAmb: tokenFrom.network == 'amb',
    amount: ethers.utils.hexValue(amountForFee),
    isAmountWithFees: isMax
  };

  const resp = await fetch(relayUrl, {
    method: 'POST',
    body: JSON.stringify(body)
  });
  if (!resp.ok) throw new Error(`Failed to get fee data: ${await resp.text()}`);
  const feeData = await resp.json();

  return {
    transferFee: BigNumber.from(feeData.transferFee),
    bridgeFee: BigNumber.from(feeData.bridgeFee),
    amount: BigNumber.from(feeData.amount),
    signature: feeData.signature
  };
}

function getAmountInForeignDecimals(
  tokenFrom: Token,
  tokenTo: Token,
  amountTokens: string
) {
  // if withdrawing tokens from ambrosus network,
  // `amount` should be the amount of tokens (in wei) that user will receive **in destination network**
  // same rule for getting fees

  const decimals =
    tokenFrom.network === 'amb' ? tokenTo.decimals : tokenFrom.decimals;
  return ethers.utils.parseUnits(amountTokens, decimals);
}

export async function withdraw({
  withdrawParams,
  getGasFee = false
}: RunWithdrawModel) {
  const { tokenFrom, tokenTo, toAddress, amountTokens, feeData, bridge } =
    withdrawParams;
  const fee = feeData.transferFee.add(feeData.bridgeFee);

  try {
    if (tokenFrom.isNativeCoin) {
      const amountBridge = ethers.utils.parseUnits(
        amountTokens,
        tokenFrom.decimals
      );
      if (getGasFee) {
        return bridge.estimateGas.wrapWithdraw(
          toAddress,
          feeData.signature,
          feeData.transferFee,
          feeData.bridgeFee,
          { value: fee.add(amountBridge) }
        );
      } else {
        return bridge.wrapWithdraw(
          toAddress,
          feeData.signature,
          feeData.transferFee,
          feeData.bridgeFee,
          { value: fee.add(amountBridge) }
        );
      }
    }

    const needUnwrap = tokenTo.isNativeCoin;
    const amountBridge = getAmountInForeignDecimals(
      tokenFrom,
      tokenTo,
      amountTokens
    );

    const amountAllowance = ethers.utils.parseUnits(
      amountTokens,
      tokenFrom.decimals
    );

    const allowance = await checkAllowance(
      tokenFrom,
      bridge.address,
      bridge.signer,
      amountAllowance
    );

    if (allowance) {
      if (getGasFee) {
        return bridge.estimateGas.withdraw(
          tokenFrom.address,
          toAddress,
          amountBridge,
          needUnwrap,
          feeData.signature,
          feeData.transferFee,
          feeData.bridgeFee,
          { value: fee }
        );
      } else {
        return bridge.withdraw(
          tokenFrom.address,
          toAddress,
          amountBridge,
          needUnwrap,
          feeData.signature,
          feeData.transferFee,
          feeData.bridgeFee,
          { value: fee }
        );
      }
    }
  } catch (e) {
    return e;
  }
}

export async function setAllowance(
  token: Token,
  bridgeAddress: string,
  signer: ethers.Signer,
  amount: BigNumberish
) {
  const erc20 = erc20Contract.attach(token.address).connect(signer);
  try {
    const newAllowance = await erc20.approve(bridgeAddress, amount);
    if (newAllowance) {
      return await newAllowance.wait();
    }
  } catch (e) {
    console.warn(`error to set new allowance value ${amount}`, e);
    return e;
    // throw new AllowanceException(token, amount, bridgeAddress);
  }
}

export async function checkAllowance(
  token: Token,
  bridgeAddress: string,
  signer: ethers.Signer,
  amount: BigNumber
) {
  const erc20 = erc20Contract.attach(token.address).connect(signer);
  const allowance = await erc20.allowance(
    await signer.getAddress(),
    bridgeAddress
  );
  if (allowance < amount) {
    return await setAllowance(token, bridgeAddress, signer, amount);
  } else {
    return allowance;
  }
}
