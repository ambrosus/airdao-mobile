import React, { useCallback } from 'react';
import { Row, Switch, Text } from '@components/base';
import { useSwapSettings } from '@features/swap/lib/hooks';

export const SettingsExpertModeForm = () => {
  const { onChangeSettings, _refSettingsGetter } = useSwapSettings();

  const onToggleExpertModle = useCallback(() => {
    onChangeSettings('extendedMode', !_refSettingsGetter.extendedMode);
  }, [_refSettingsGetter.extendedMode, onChangeSettings]);

  return (
    <Row alignItems="center" justifyContent="space-between">
      <Text>Toggle expert mode</Text>
      <Switch
        value={_refSettingsGetter.extendedMode}
        onValueChange={onToggleExpertModle}
      />
    </Row>
  );
};
