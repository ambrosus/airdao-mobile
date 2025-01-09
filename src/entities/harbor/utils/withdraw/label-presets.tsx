import React from 'react';
import { Row, Spacer, Text } from '@components/base';
import { WithdrawWarningIcon } from '@components/svg/icons/v2/harbor';
import { WithdrawCheckmarkIcon } from '@components/svg/icons/v2/harbor/WithdrawCheckmarkIcon';
import { COLORS } from '@constants/colors';

type Type = 'success' | 'error' | 'warning';

export function getWithdrawInputLabel(type: Type, timestamp?: number) {
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
            Lock period complete
          </Text>
        </Row>
      );
    }
    case 'error': {
      const date = new Date(timestamp ?? 0 * 1000).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      return (
        <Row alignItems="center">
          <WithdrawWarningIcon />
          <Spacer horizontal value={4} />
          <Text
            fontSize={12}
            fontFamily="Inter_600SemiBold"
            color={COLORS.neutral0}
          >
            Available on {date}
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
            Please note: to withdraw HBR, you first need to{' '}
            <Text
              fontSize={12}
              fontFamily="Inter_600SemiBold"
              color={COLORS.neutral0}
              style={{ textDecorationLine: 'underline' }}
            >
              withdraw AMB
            </Text>
          </Text>
        </Row>
      );
    }
  }
}
