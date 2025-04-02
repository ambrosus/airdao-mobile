import { ethers } from 'ethers';
import Config from '@constants/config';
import { ALLOWANCE } from '@features/swap/lib/abi';
import { AllowanceArgs } from '@features/swap/types';
import { createSigner } from '@features/swap/utils/contracts/instances';

export async function checkIsApprovalRequired({
  address,
  privateKey,
  amount
}: AllowanceArgs) {
  try {
    if (address !== ethers.constants.AddressZero) {
      const signer = createSigner(privateKey);

      const erc20Contract = new ethers.Contract(
        ethers.constants.AddressZero,
        ALLOWANCE
      );

      const erc20 = erc20Contract.attach(address).connect(signer);

      const allowance = await erc20.allowance(
        await signer.getAddress(),
        Config.ROUTER_V2_ADDRESS
      );

      return allowance.lt(amount);
    }
  } catch (error) {
    throw error;
  }
}

export async function increaseAllowance({
  address,
  privateKey,
  amount,
  estimateGas = false
}: AllowanceArgs & { estimateGas?: boolean }) {
  try {
    const signer = createSigner(privateKey);

    const erc20Contract = new ethers.Contract(
      ethers.constants.AddressZero,
      ALLOWANCE
    );

    const { approve, estimateGas: _estimateGas } = erc20Contract
      .attach(address)
      .connect(signer);

    if (estimateGas)
      return await _estimateGas.approve(Config.ROUTER_V2_ADDRESS, amount);

    return approve(Config.ROUTER_V2_ADDRESS, amount);
  } catch (error) {
    throw error;
  }
}
