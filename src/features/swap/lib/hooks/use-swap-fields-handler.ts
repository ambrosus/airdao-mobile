import { useSwapContextSelector } from '@features/swap/context';
import { SelectedTokensKeys } from '@features/swap/types';

export function useSwapFieldsHandler() {
  const { setSelectedTokensAmount } = useSwapContextSelector();

  const onChangeSelectedTokenAmount = (
    key: SelectedTokensKeys,
    amount: string
  ) => {
    setSelectedTokensAmount((prevSelectedTokensAmount) => ({
      ...prevSelectedTokensAmount,
      [key]: amount
    }));
  };

  return { onChangeSelectedTokenAmount };
}
