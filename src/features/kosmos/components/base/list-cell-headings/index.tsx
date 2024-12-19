import React, { useMemo } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import capitalize from 'lodash/capitalize';
import { Row, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils';

export const ListCellHeadings = () => {
  const { t } = useTranslation();

  const LIST_HEADER_TITLES = [
    'bonds',
    t('kosmos.table.headings.discount'),
    t('kosmos.table.headings.value')
  ];

  const listHeadingsStyle: StyleProp<ViewStyle> = useMemo(() => {
    return {
      paddingLeft: scale(16),
      paddingRight: scale(31),
      paddingBottom: verticalScale(16)
    };
  }, []);

  return (
    <Row
      alignItems="center"
      justifyContent="space-between"
      style={listHeadingsStyle}
    >
      {LIST_HEADER_TITLES.map((heading, index) => (
        <Text
          key={index}
          fontSize={12}
          fontFamily="Inter_500Medium"
          color={COLORS.neutral600}
        >
          {capitalize(heading)}
        </Text>
      ))}
    </Row>
  );
};
