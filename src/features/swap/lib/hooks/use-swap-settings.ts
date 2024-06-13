import { useSwapContextSelector } from '@features/swap/context';

export function useSwapSettings() {
  const { setSlippageTolerance } = useSwapContextSelector();

  const onChangeSlippageTolerance = (value: string) => {
    setSlippageTolerance(value);
  };

  return { onChangeSlippageTolerance };
}
