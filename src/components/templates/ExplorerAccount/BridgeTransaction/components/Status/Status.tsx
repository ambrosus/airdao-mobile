import React from 'react';
import { Text, View } from 'react-native';
import {
  confirmationStyles,
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
  const statusStyle = (() => {
    switch (transactionStatus) {
      case 'success':
        return { ...successStyle };
      case 'confirmations': {
        return { ...confirmationStyles };
      }
      case 'pending':
        return { ...pendingStyle };
      default:
        return { ...errorStyle };
    }
  })();

  const statusText = (() => {
    switch (status) {
      case 'success':
      case 'pending':
      case 'confirmations':
        return `${transactionStatus
          .charAt(0)
          .toUpperCase()}${transactionStatus.slice(1)}`;
      default:
        return 'Error';
    }
  })();

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
