import React, { useCallback } from 'react';
import { Row, Switch, Text } from '@components/base';
import {
  useSwapFieldsHandler,
  useSwapSettings
} from '@features/swap/lib/hooks';

export const SettingsMultiHopForm = () => {
  const { updateReceivedTokensOutput } = useSwapFieldsHandler();
  const { onChangeSettings, _refSettingsGetter } = useSwapSettings();

  const onToggleMultiHopsAllowance = useCallback(() => {
    onChangeSettings('multihops', !_refSettingsGetter.multihops);

    setTimeout(async () => {
      await updateReceivedTokensOutput();
    }, 250);
  }, [
    _refSettingsGetter.multihops,
    onChangeSettings,
    updateReceivedTokensOutput
  ]);

  return (
    <Row alignItems="center" justifyContent="space-between">
      <Text>Disable multihops</Text>
      <Switch
        value={!_refSettingsGetter.multihops}
        onValueChange={onToggleMultiHopsAllowance}
      />
    </Row>
  );
};
