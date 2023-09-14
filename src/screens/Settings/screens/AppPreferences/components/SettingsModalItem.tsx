import React, { FC } from 'react';
import { Row, Text } from '@components/base';
import { RadioButton } from '@components/base/RadioButton';
import { COLORS } from '@constants/colors';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { scale } from '@utils/scaling';
import { Currency, Language } from '@appTypes';

type Props = {
  item: Language | Currency;
  handleItemPress: (value: any) => void;
  modalActiveItem: Language | Currency;
};

export const SettingsModalItem: FC<Props> = ({
  item,
  modalActiveItem,
  handleItemPress
}) => {
  const isActive = modalActiveItem === item;
  const textColor = isActive ? COLORS.nero : COLORS.slateGrey;

  return (
    <TouchableOpacity
      onPress={() => handleItemPress(item)}
      style={styles.container}
    >
      <Row style={styles.itemInfo} alignItems="center">
        <RadioButton
          testID="radio-button"
          isActive={isActive}
          onPress={() => handleItemPress(item)}
        />
        <Text
          fontFamily="Inter_600SemiBold"
          fontSize={16}
          color={textColor}
          style={styles.itemTitle}
        >
          {item}
        </Text>
      </Row>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(18),
    paddingBottom: 32,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemInfo: {},
  itemTitle: {
    paddingLeft: 12
  }
});
