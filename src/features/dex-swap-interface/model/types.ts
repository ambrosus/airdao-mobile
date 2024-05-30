import { TokenInfo } from '../types';

type CombinedFieldValue = TokenInfo & {
  value?: number;
};

export interface FieldSelectedTokens {
  INPUT: CombinedFieldValue | null;
  OUTPUT: CombinedFieldValue | null;
}
