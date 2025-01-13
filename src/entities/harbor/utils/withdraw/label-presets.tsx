import React from 'react';
import { LanguageCode } from '@appTypes';
import { Row, Spacer, Text } from '@components/base';
import { WithdrawWarningIcon } from '@components/svg/icons/v2/harbor';
import { WithdrawCheckmarkIcon } from '@components/svg/icons/v2/harbor/WithdrawCheckmarkIcon';
import { COLORS } from '@constants/colors';
import i18n from '@localization/i18n';

type Type = 'success' | 'error' | 'warning';

const localeKey = {
  en: 'en-US',
  tr: 'tr-TR'
};

export function getWithdrawInputLabel(
  type: Type,
  timestamp?: number,
  currentLanguage?: LanguageCode
) {
  switch (type) {
    case 'success': {
      return (
        <Row alignItems="center">
          <WithdrawCheckmarkIcon />
          <Spacer horizontal value={4} />
          <Text
            fontSize={12}
            fontFamily="Inter_600SemiBold"
            color={COLORS.neutral0}
          >
            {i18n.t('harbor.stake.period.complete')}
          </Text>
        </Row>
      );
    }
    case 'error': {
      const date = new Date(timestamp ?? 0 * 1000).toLocaleString(
        localeKey[(currentLanguage as keyof typeof localeKey) ?? 'en'],
        {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }
      );
      return (
        <Row alignItems="center">
          <WithdrawWarningIcon />
          <Spacer horizontal value={4} />
          <Text
            fontSize={12}
            fontFamily="Inter_600SemiBold"
            color={COLORS.neutral0}
          >
            {i18n.t('harbor.stake.unlock.date', {
              date
            })}
          </Text>
        </Row>
      );
    }
    case 'warning': {
      return (
        <Row alignItems="center">
          <WithdrawWarningIcon />
          <Spacer horizontal value={4} />
          <Text
            fontSize={12}
            fontFamily="Inter_600SemiBold"
            color={COLORS.neutral0}
            style={{ flex: 1 }}
          >
            {i18n.t('harbor.withdraw.warning.regular')}{' '}
            <Text
              fontSize={12}
              fontFamily="Inter_600SemiBold"
              color={COLORS.neutral0}
              style={{ textDecorationLine: 'underline' }}
            >
              {i18n.t('harbor.withdraw.warning.highlight')}
            </Text>
          </Text>
        </Row>
      );
    }
  }
}
