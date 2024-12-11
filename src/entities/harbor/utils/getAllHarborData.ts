import { harborService } from '@api/harbor/harbor-service';
import { getHarborToken } from '@entities/harbor/utils/getHarborToken';

export const getAllHarborData = async (address: string) => {
  try {
    const data = Promise.all([
      ['apr', await harborService.getStakeAPR()],
      ['totalStaked', await harborService.getTotalStaked()],
      ['stakeLimit', await harborService.getStakeLimit()],
      ['userStaked', await harborService.getUserStaked(address)],
      ['tier', await harborService.getTier(address)],
      ['unStakeLimit', await harborService.getUnStakeLockTime()],
      ['token', await getHarborToken(address)]
    ]);
    if (data) {
      return data;
    }
  } catch (e) {
    // ignore
  }
};
