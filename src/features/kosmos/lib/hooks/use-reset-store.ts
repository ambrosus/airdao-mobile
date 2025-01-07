import { useCallback } from 'react';
import { useChartStore, usePurchaseStore } from '@features/kosmos';

export function useResetStore() {
  const { onChangeBnBalance, onChangeAmountToBuy } = usePurchaseStore();
  const { onToggleIsChartTooltipVisible } = useChartStore();

  const reset = useCallback(() => {
    onChangeAmountToBuy('');
    onChangeBnBalance(null);
    onToggleIsChartTooltipVisible(false);
  }, [onChangeAmountToBuy, onChangeBnBalance, onToggleIsChartTooltipVisible]);

  return { reset };
}
