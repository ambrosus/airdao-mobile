import { renderHook } from '@testing-library/react-native';
import { useDEXSwapActionsHandler } from '../useDEXSwapActionsHandler';

describe('useDEXSwapActionsHandler hook unit test', () => {
  it('Test button label with prepared pairs | SAMB - AMB', () => {
    const pair = { from: 'SAMB', to: 'AMB' };

    const { result } = renderHook(() => useDEXSwapActionsHandler());
    const { buttonActionString } = result.current;

    const _label = buttonActionString(pair);
    expect(_label).toBe('Unwrap');
  });

  it('Test button label with prepared pairs | USDC - AMB', () => {
    const pair = { from: 'USDC', to: 'AMB' };

    const { result } = renderHook(() => useDEXSwapActionsHandler());
    const { buttonActionString } = result.current;

    const _label = buttonActionString(pair);
    expect(_label).toBe('Swap');
  });

  it('Test button label with prepared pairs | USDC - AMB', () => {
    const pair = { from: 'SAMB', to: 'USDC' };

    const { result } = renderHook(() => useDEXSwapActionsHandler());
    const { buttonActionString } = result.current;

    const _label = buttonActionString(pair);
    expect(_label).toBe('Approve USDC');
  });
});
