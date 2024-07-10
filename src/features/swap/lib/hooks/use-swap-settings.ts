import { useSwapContextSelector } from '@features/swap/context';
import { Settings, SettingsKeys } from '@features/swap/types';
import { useCallback, useEffect, useRef } from 'react';

export function useSwapSettings() {
  const { setSettings, _refSettingsGetter } = useSwapContextSelector();
  const settings = useRef<Settings>(_refSettingsGetter);

  useEffect(() => {
    settings.current = _refSettingsGetter;
  }, [_refSettingsGetter]);

  const onChangeSettings = useCallback(
    (key: SettingsKeys, value: string | boolean) => {
      setSettings({
        ..._refSettingsGetter,
        [key]: value
      });
    },
    [_refSettingsGetter, setSettings]
  );

  return { onChangeSettings, settings, _refSettingsGetter };
}
