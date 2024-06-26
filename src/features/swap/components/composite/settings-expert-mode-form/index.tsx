import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Row, Switch, Text } from '@components/base';
import { useSwapSettings } from '@features/swap/lib/hooks';

export const SettingsExpertModeForm = () => {
  const { t } = useTranslation();
  const { onChangeSettings, _refSettingsGetter } = useSwapSettings();

  const onToggleExpertModle = useCallback(() => {
    onChangeSettings('extendedMode', !_refSettingsGetter.extendedMode);
  }, [_refSettingsGetter.extendedMode, onChangeSettings]);

  return (
    <Row alignItems="center" justifyContent="space-between">
      <Text>{t('swap.settings.expert')}</Text>
      <Switch
        value={_refSettingsGetter.extendedMode}
        onValueChange={onToggleExpertModle}
      />
    </Row>
  );
};
