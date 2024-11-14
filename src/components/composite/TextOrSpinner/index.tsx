import React from 'react';
import { Row, Spacer, Spinner, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { FontFamily } from '@components/base/Text/Text.types';
import { scale } from '@utils/scaling';

interface TextOrSpinnerProps {
  loading: boolean;
  loadingLabel: string;
  label: string;
  styles?: Partial<{
    loading: Partial<{
      fontSize: number;
      fontFamily: FontFamily;
      color: string;
    }>;
    active: Partial<{
      fontSize: number;
      fontFamily: FontFamily;
      color: string;
    }>;
  }>;
}

export const TextOrSpinner = ({
  loading,
  loadingLabel,
  label,
  styles = {
    loading: {
      fontSize: 16,
      fontFamily: 'Inter_600SemiBold',
      color: COLORS.brand600
    },
    active: {
      fontSize: 16,
      fontFamily: 'Inter_600SemiBold',
      color: loading ? COLORS.brand75 : COLORS.neutral0
    }
  }
}: TextOrSpinnerProps) => {
  return (
    <>
      {loading ? (
        <Row alignItems="center">
          <Spinner size="xs" />
          <Spacer horizontal value={scale(8)} />
          <Text
            fontSize={styles.loading?.fontSize}
            fontFamily={styles.loading?.fontFamily}
            color={styles.loading?.color}
          >
            {loadingLabel}
          </Text>
        </Row>
      ) : (
        <Text
          fontSize={styles.active?.fontSize}
          fontFamily={styles.active?.fontFamily}
          color={styles.active?.color}
        >
          {label}
        </Text>
      )}
    </>
  );
};
