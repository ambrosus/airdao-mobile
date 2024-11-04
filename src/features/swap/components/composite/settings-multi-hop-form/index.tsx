import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Row, Switch, Text } from '@components/base';
import {
  useSwapFieldsHandler,
  useSwapSettings
} from '@features/swap/lib/hooks';
import { COLORS } from '@constants/colors';

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
      <Text
        fontSize={16}
        fontFamily="Inter_400Regular"
        color={COLORS.neutral800}
      >
        {t('swap.settings.multihops')}
      </Text>
      <Switch
        style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
        value={!_refSettingsGetter.multihops}
        onValueChange={onToggleMultiHopsAllowance}
      />
    </Row>
  );
};
