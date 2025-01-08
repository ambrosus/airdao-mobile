import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Row, Switch, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { useSwapSettings } from '@features/swap/lib/hooks';

export const SettingsExpertModeForm = () => {
  const { t } = useTranslation();
  const { onChangeSettings, _refSettingsGetter } = useSwapSettings();

  const onToggleExpertMode = useCallback(() => {
    onChangeSettings('extendedMode', !_refSettingsGetter.extendedMode);
  }, [_refSettingsGetter.extendedMode, onChangeSettings]);

  return (
    <Row alignItems="center" justifyContent="space-between">
      <Text
        fontSize={16}
        fontFamily="Inter_400Regular"
        color={COLORS.neutral800}
      >
        {t('swap.settings.expert')}
      </Text>
      <Switch
        style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
        value={_refSettingsGetter.extendedMode}
        onValueChange={onToggleExpertMode}
      />
    </Row>
  );
};
