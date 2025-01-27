import { useMemo } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from '@components//base';
import {
  claimPendingStyle,
  confirmationStyles,
  defaultStyle,
  errorStyle,
  pendingStyle,
  styles,
  successStyle
} from './Status.styles';

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
      case 'success':
        return { ...successStyle };
      case 'confirmations': {
        return { ...confirmationStyles };
      }
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
        return t('kosmos.button.claimed');
      case 'ready to claim':
        return 'Ready to claim';
      case 'active':
        return t('kosmos.status.active');
      case 'closed':
        return t('kosmos.status.closed');
      case 'pending':
      case 'claim pending':
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

      <Text
        style={{
          ...styles.statusText,
          ...statusStyle.text
        }}
      >
        {statusText}
      </Text>
    </View>
  );
};
