import React from 'react';
import { Text, View } from 'react-native';
import {
  errorStyle,
  pendingStyle,
  styles,
  successStyle
} from './Status.styles';

export const Status = ({ status }: { status: string }) => {
  const transactionStatus = status.toLowerCase();
  const statusStyle = (() => {
    switch (transactionStatus) {
      case 'success':
        return { ...successStyle };
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
        return `${transactionStatus
          .charAt(0)
          .toUpperCase()}${transactionStatus.slice(1)}`;
      default:
        return 'Error';
    }
  })();

  return (
    <View style={{ ...styles.statusMain, ...statusStyle.background }}>
      <Text style={{ ...styles.statusText, ...statusStyle.text }}>
        {statusText}
      </Text>
    </View>
  );
};
