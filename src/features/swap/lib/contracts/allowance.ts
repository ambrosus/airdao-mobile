import { ethers } from 'ethers';
import { SWAP_DEFAULT_SUPPORTED_TOKENS } from '@features/swap/entities';
import { ERC20_ALLOWANCE } from '@features/swap/lib/abi';
import { AllowanceArgs } from '@features/swap/types';
import { createSigner } from '@features/swap/utils/contracts/instances';
import { environment } from '@utils/environment';
import Config from '@constants/config';

export async function checkIsApprovalRequired({
  address,
  privateKey,
  amount
}: AllowanceArgs) {
  try {
    if (
      address !== SWAP_DEFAULT_SUPPORTED_TOKENS.default[environment].address
    ) {
      const signer = createSigner(privateKey);

      const erc20Contract = new ethers.Contract(
        ethers.constants.AddressZero,
        ERC20_ALLOWANCE
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
  amount
}: AllowanceArgs) {
  try {
    const signer = createSigner(privateKey);

    const erc20Contract = new ethers.Contract(
      ethers.constants.AddressZero,
      ERC20_ALLOWANCE
    );

    const erc20 = erc20Contract.attach(address).connect(signer);

    return erc20.approve(Config.ROUTER_V2_ADDRESS, amount);
  } catch (error) {
    throw error;
  }
}
