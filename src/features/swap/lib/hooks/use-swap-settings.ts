import { useCallback, useEffect, useRef } from 'react';
import { useSwapContextSelector } from '@features/swap/context';
import { Settings, SettingsKeys } from '@features/swap/types';
import { StringUtils, NumberUtils } from '@utils';

export function useSwapSettings() {
  const { setSettings, _refSettingsGetter } = useSwapContextSelector();
  const settings = useRef<Settings>(_refSettingsGetter);

  useEffect(() => {
    settings.current = _refSettingsGetter;
  }, [_refSettingsGetter]);

  const onChangeDeadline = useCallback(
    (value: string) => {
      if (/^0$|[.,]/.test(value)) return;

      return setSettings((prevState) => ({
        ...prevState,
        deadline: StringUtils.formatNumberInput(value)
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
