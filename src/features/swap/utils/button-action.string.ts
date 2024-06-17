import { formatEther } from 'ethers/lib/utils';
import {
  FIELD,
  MultiplyBalancesStateType,
  SelectedTokensAmountState,
  SelectedTokensState
} from '../types';
import { NumberUtils } from '@utils/number';

export function buttonActionString(
  selectedTokens: SelectedTokensState,
  selectedAmount: SelectedTokensAmountState,
  bnBalanceAmount: MultiplyBalancesStateType,
  lastChangedInput: keyof typeof FIELD
) {
  const emptyInputValue = '' || '0';

  const isSomeTokenNotSelected =
    !selectedTokens.TOKEN_A || !selectedTokens.TOKEN_B;

  const isSomeBalanceIsEmpty =
    selectedAmount.TOKEN_A === emptyInputValue ||
    selectedAmount.TOKEN_B === emptyInputValue;

  if (isSomeBalanceIsEmpty || isSomeTokenNotSelected) {
    return 'Enter amount';
  }

  const lastChangedInputBalance = bnBalanceAmount[lastChangedInput]?._hex;

  if (lastChangedInputBalance) {
    const normalizedBalanceAmount = NumberUtils.limitDecimalCount(
      formatEther(lastChangedInputBalance),
      2
    );

    if (normalizedBalanceAmount < selectedAmount[lastChangedInput]) {
      return 'Insufficient funds';
    }
  }

  return 'Review swap';
}
