import { COLORS } from '@constants/colors';

export const PriceImpactExpertModeColors = (expertMode: boolean): string[] => {
  return expertMode
    ? [COLORS.error500, COLORS.error500]
    : [COLORS.error300, COLORS.error300];
};
