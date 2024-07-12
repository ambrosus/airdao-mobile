import { FiltersState } from '../types';

export function filter<T>(filters: FiltersState, array: T[]): T[] {
  return array;
}
