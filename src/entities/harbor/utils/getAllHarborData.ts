import { harborService } from '@api/harbor/harbor-service';

export const getAllHarborData = async (address: string) => {
  try {
    const data = Promise.all([
      ['apr', await harborService.getStakeAPR()],
      ['totalStaked', await harborService.getTotalStaked()],
      ['stakeLimit', await harborService.getStakeLimit()],
      ['userStaked', await harborService.getUserStaked(address)]
    ]);
    if (data) {
      return data;
    }
  } catch (e) {
    // ignore
  }
};
