import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Row, Switch, Text } from '@components/base';
import {
  useSwapFieldsHandler,
  useSwapSettings
} from '@features/swap/lib/hooks';

export const SettingsMultiHopForm = () => {
  const { t } = useTranslation();
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
      <Text>{t('swap.settings.multihops')}</Text>
      <Switch
        value={!_refSettingsGetter.multihops}
        onValueChange={onToggleMultiHopsAllowance}
      />
    </Row>
  );
};
