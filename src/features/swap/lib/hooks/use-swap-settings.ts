import { useCallback, useEffect, useRef } from 'react';
import { useSwapContextSelector } from '@features/swap/context';
import { Settings, SettingsKeys } from '@features/swap/types';
import { NumberUtils } from '@utils/number';
import { StringUtils } from '@utils/string';

export function useSwapSettings() {
  const { setSettings, _refSettingsGetter } = useSwapContextSelector();
  const settings = useRef<Settings>(_refSettingsGetter);

  useEffect(() => {
    settings.current = _refSettingsGetter;
  }, [_refSettingsGetter]);

  const onChangeDeadline = useCallback(
    (value: string) => {
      if (value === '0' || value.includes('.') || value.includes(',')) {
        return;
      }
      const finalValue = StringUtils.formatNumberInput(value);

      return setSettings((prevState) => ({
        ...prevState,
        deadline: finalValue
      }));
    },
    [setSettings]
  );

  const onChangeSlippageTolerance = useCallback(
    (value: string) => {
      const decimalsLength = 2;
      let finalValue = StringUtils.formatNumberInput(value);
      finalValue = NumberUtils.limitDecimalCount(finalValue, decimalsLength);

      return setSettings({
        ..._refSettingsGetter,
        slippageTolerance: finalValue
      });
    },
    [_refSettingsGetter, setSettings]
  );

  const onChangeSettings = useCallback(
    (key: SettingsKeys, value: string | boolean) => {
      switch (key) {
        case 'deadline':
          return onChangeDeadline(value as string);
        case 'slippageTolerance':
          return onChangeSlippageTolerance(value as string);
        default:
          return setSettings({
            ..._refSettingsGetter,
            [key]: value
          });
      }
    },
    [
      _refSettingsGetter,
      onChangeDeadline,
      onChangeSlippageTolerance,
      setSettings
    ]
  );

  return { onChangeSettings, settings, _refSettingsGetter };
}
