import React, { ReactNode } from 'react';
import { upperCase } from 'lodash';
import { Row, Text } from '@components/base';
import { COLORS } from '@constants/colors';

interface RowJustifyAlignedItemProps {
  label: string;
  children: ReactNode;
}

export const RowJustifyAlignedItem = ({
  label,
  children
}: RowJustifyAlignedItemProps) => {
  return (
    <Row alignItems="center" justifyContent="space-between">
      <Text
        fontSize={12}
        fontFamily="Inter_500Medium"
        color={COLORS.neutral600}
      >
        {upperCase(label)}
      </Text>

      {children}
    </Row>
  );
};
