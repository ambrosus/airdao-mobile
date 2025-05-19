import { hbrYieldService } from '@api/harbor';
import { showCriticalError } from '@components/CriticalErrorHandler';

const handleServiceError = (e: any) => {
  showCriticalError({
    title: 'critical.error.harbor.header',
    message: 'critical.error.harbor.subheader'
  });
  throw e;
};

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
    return handleServiceError(error);
  }
}
