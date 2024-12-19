import React from 'react';
import { Row, Spacer, Spinner, Text } from '@components/base';
import { FontFamily } from '@components/base/Text/Text.types';
import { COLORS } from '@constants/colors';
import { scale } from '@utils';

interface TextOrSpinnerProps {
  loading: boolean;
  loadingLabel: string | undefined;
  label: string;
  spinnerColor?: string;
  spinnerCustomSize?: number;
  spinnerSize?: 'large' | 'small' | 'xs';
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
  spinnerColor,
  spinnerCustomSize,
  spinnerSize = 'xs',
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
          <Spinner
            customSize={spinnerCustomSize}
            color={spinnerColor}
            size={spinnerSize}
          />
          {loadingLabel && (
            <>
              <Spacer horizontal value={scale(8)} />
              <Text
                fontSize={styles.loading?.fontSize}
                fontFamily={styles.loading?.fontFamily}
                color={styles.loading?.color}
              >
                {loadingLabel}
              </Text>
            </>
          )}
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
