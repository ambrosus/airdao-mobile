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
  const { TOKEN_A, TOKEN_B } = selectedTokens;
  const { TOKEN_A: AMOUNT_A, TOKEN_B: AMOUNT_B } = selectedAmount;
  const emptyInputValue = '' && '0';

  const isSomeTokenNotSelected = !TOKEN_A || !TOKEN_B;

  const isSomeBalanceIsEmpty =
    AMOUNT_A === emptyInputValue || AMOUNT_B === emptyInputValue;

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
