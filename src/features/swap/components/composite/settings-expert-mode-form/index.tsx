import React, { useCallback } from 'react';
import { Row, Switch, Text } from '@components/base';
import { useSwapSettings } from '@features/swap/lib/hooks';

export const SettingsExpertModeForm = () => {
  const { settings, onChangeSettings, _refSettingsGetter } = useSwapSettings();

  const onToggleExpertModle = useCallback(() => {
    onChangeSettings('extendedMode', !_refSettingsGetter.extendedMode);
  }, [_refSettingsGetter.extendedMode, onChangeSettings]);

  return (
    <Row alignItems="center" justifyContent="space-between">
      <Text>Toggle expert mode</Text>
      <Switch
        value={settings.current.extendedMode}
        onValueChange={onToggleExpertModle}
      />
    </Row>
  );
};
