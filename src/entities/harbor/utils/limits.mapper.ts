import { ethers } from 'ethers';
import {
  INITIAL_LIMITS,
  INITIAL_ETHERS_ZERO
} from './stake-hbr-store-initials';
import type { LimitsConfig } from '../model';

export function limitsConfigMapper<T>(limitsConfigValues: T[]): LimitsConfig {
  return Object.keys(INITIAL_LIMITS).reduce<LimitsConfig>((acc, key, index) => {
    acc[key as keyof LimitsConfig] =
      (limitsConfigValues[index] as ethers.BigNumber) ?? INITIAL_ETHERS_ZERO;
    return acc;
  }, {} as LimitsConfig);
}
