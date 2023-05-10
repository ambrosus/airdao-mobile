import React, { FC } from 'react';
import { Language } from '@screens/Settings/components/SettingsBlock/modals/BottomSheetSelectLanguage';
import { Currency } from '@screens/Settings/components/SettingsBlock/modals/BottomSheetBaseCurrency';
import { Row, Text } from '@components/base';
import { RadioButton } from '@components/base/RadioButton';
import { COLORS } from '@constants/colors';
import { StyleSheet, View } from 'react-native';

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
  return (
    <View style={styles.container}>
      <Row style={styles.itemInfo} alignItems="center">
        <RadioButton
          testID="radio-button"
          isActive={modalActiveItem === item}
          onPress={() => handleItemPress(item)}
        />
        <Text
          fontFamily="Inter_600SemiBold"
          fontSize={17}
          color={COLORS.smokyBlack}
          style={styles.itemTitle}
        >
          {item}
        </Text>
      </Row>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingBottom: 32,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemInfo: {},
  itemTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 17,
    paddingLeft: 12
  }
});
