import { harborService } from '@api/harbor/harbor-service';
import { showCriticalError } from '@components/CriticalErrorHandler';
import { getHarborToken } from '@entities/harbor/utils/getHarborToken';

const handleServiceError = (e: any) => {
  showCriticalError({
    title: 'critical.error.harbor.header',
    message: 'critical.error.harbor.subheader'
  });
  throw e;
};

export const getAllHarborData = async (address: string) => {
  try {
    const data = await Promise.all([
      ['apr', await harborService.getStakeAPR()],
      ['totalStaked', await harborService.getTotalStaked()],
      ['stakeLimit', await harborService.getStakeLimit()],
      ['userStaked', await harborService.getUserStaked(address)],
      ['tier', await harborService.getTier(address)],
      ['unStakeDelay', await harborService.getUnstakeLockTime()],
      ['token', await getHarborToken(address)]
    ]);

    return data;
  } catch (error) {
    return handleServiceError(error);
  }
};
