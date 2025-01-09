import { calculateAPR } from '@api/harbor/harbor-service';
import { useStakeHBRStore } from '@entities/harbor/model';

export function useGetPoolYieldAPY() {
  const { limitsConfig } = useStakeHBRStore();

  if (
    limitsConfig?.interest === undefined ||
    limitsConfig?.interestRate === undefined
  ) {
    return undefined;
  }

  const { interest, interestRate } = limitsConfig;

  if (isNaN(Number(interest)) && isNaN(Number(interestRate))) {
    return undefined;
  }

  return calculateAPR(Number(interest), Number(interestRate));
}
