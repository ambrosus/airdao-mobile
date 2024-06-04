import { renderHook } from '@testing-library/react-native';
import { useDEXSwapActionsHandler } from '../use-dex-swap-actions-handler';

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

  it('Test button label with wrong pairs | USDC - USDT', () => {
    const pair = { from: 'USDC', to: 'USDT' };

    const { result } = renderHook(() => useDEXSwapActionsHandler());
    const { buttonActionString } = result.current;

    const _label = buttonActionString(pair);
    expect(_label).toBe('Wrong pair');
  });
});
