import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import {
  confirmationStyles,
  defaultStyle,
  errorStyle,
  pendingStyle,
  styles,
  successStyle,
  claimPendingStyle
} from './Status.styles';
import { useTranslation } from 'react-i18next';

interface StatusProps {
  status: string;
  steps?: {
    start: number;
    end: number;
  };
}

export const Status = ({ status, steps }: StatusProps) => {
  const transactionStatus = status.toLowerCase();

  const statusStyle = useMemo(() => {
    switch (transactionStatus) {
      case 'active':
      case 'claimed':
      case 'success':
        return { ...successStyle };
      case 'closed': {
        return { ...defaultStyle };
      }
      case 'confirmations': {
        return { ...confirmationStyles };
      }
      case 'claim pending':
        return { ...claimPendingStyle };
      case 'default':
        if (steps && steps.start !== 0 && steps?.start === steps?.end) {
          return { ...successStyle };
        }
        return {
          ...defaultStyle
        };
      case 'ready to claim':
      case 'pending':
        return { ...pendingStyle };
      default:
        return { ...errorStyle };
    }
  }, [transactionStatus, steps]);

  const { t } = useTranslation();

  const statusText = useMemo(() => {
    switch (status) {
      case 'success':
        return t('common.status.success');
      case 'claimed':
        return 'Claimed';
      case 'ready to claim':
        return 'Ready to claim';
      case 'claim pending':
        return 'Pending';
      case 'active':
        return 'Active';
      case 'closed':
        return 'Closed';
      case 'pending':
        return t('common.status.pending');
      case 'confirmations':
        return t('bridge.transaction.confirmations');
      case 'default': {
        return steps?.start && steps.end
          ? `${steps.start}/${steps.end}`
          : t('common.status.not.started');
      }
      default:
        return t('common.status.failed');
    }
  }, [status, steps, t]);

  return (
    <View style={{ ...styles.statusMain, ...statusStyle.background }}>
      {status === 'confirmations' && (
        <Text style={{ ...styles.statusText, ...statusStyle.text }}>
          {steps?.start}/{steps?.end}
        </Text>
      )}

      <Text style={{ ...styles.statusText, ...statusStyle.text }}>
        {statusText}
      </Text>
    </View>
  );
};
