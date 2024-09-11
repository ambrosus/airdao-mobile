import { useSwapContextSelector } from '@features/swap/context';
import { Settings, SettingsKeys } from '@features/swap/types';
import { NumberUtils } from '@utils/number';
import { StringUtils } from '@utils/string';
import { useCallback, useEffect, useRef } from 'react';

export function useSwapSettings() {
  const { setSettings, _refSettingsGetter } = useSwapContextSelector();
  const settings = useRef<Settings>(_refSettingsGetter);

  useEffect(() => {
    settings.current = _refSettingsGetter;
  }, [_refSettingsGetter]);

  const onChangeSettings = useCallback(
    (key: SettingsKeys, value: string | boolean) => {
      if (
        (key === 'slippageTolerance' || key === 'deadline') &&
        typeof value === 'string'
      ) {
        const decimalsLength = key === 'slippageTolerance' ? 2 : 0;
        let finalValue = StringUtils.formatNumberInput(value);
        finalValue = NumberUtils.limitDecimalCount(finalValue, decimalsLength);

        return setSettings({
          ..._refSettingsGetter,
          [key]: finalValue
        });
      }

      return setSettings({
        ..._refSettingsGetter,
        [key]: value
      });
    },
    [_refSettingsGetter, setSettings]
  );

  return { onChangeSettings, settings, _refSettingsGetter };
}
