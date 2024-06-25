import React, { useCallback } from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import { Row, Text } from '@components/base';
import { TextInput } from '@components/base/Input/Input.text';
import { COLORS } from '@constants/colors';
import { useSwapSettings } from '@features/swap/lib/hooks';

export const SettingsDeadlineForm = () => {
  const { settings, onChangeSettings } = useSwapSettings();

  const onChangeDeadline = useCallback(
    (value: string) => {
      onChangeSettings('deadline', value);
    },
    [onChangeSettings]
  );

  return (
    <View style={styles.container}>
      <View style={styles.inputWithLabel}>
        <Text
          fontSize={16}
          fontFamily="Inter_500Medium"
          color={COLORS.neutral500}
        >
          Transaction deadline
        </Text>

        <Row alignItems="center" justifyContent="space-between">
          <TextInput
            type="number"
            keyboardType="numeric"
            style={styles.input}
            placeholder="20"
            value={settings.deadline}
            onChangeText={onChangeDeadline}
          />
          <Text
            fontSize={16}
            fontFamily="Inter_500Medium"
            color={COLORS.neutral600}
          >
            minutes
          </Text>
        </Row>
      </View>
    </View>
  );
};
