import { hbrYieldService } from '@api/harbor';

export async function stakeHBRPromise(address: string) {
  try {
    return Promise.all([
      await hbrYieldService.staked(address),
      await hbrYieldService.rewards(address),
      await hbrYieldService.deposit(address),
      await hbrYieldService.limitConfig(),
      await hbrYieldService.liquidityPool(),
      await hbrYieldService.maxUserStakeLimit(address),
      await hbrYieldService.allowance(address)
    ]);
  } catch (error) {
    throw error;
  }
}
