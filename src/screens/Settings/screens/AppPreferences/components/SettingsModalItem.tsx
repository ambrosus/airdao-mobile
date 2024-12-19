import React, { FC } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Currency, Language } from '@appTypes';
import { Row, Text } from '@components/base';
import { RadioButton } from '@components/base/RadioButton';
import { COLORS } from '@constants/colors';
import { scale } from '@utils';

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
  const { t } = useTranslation();
  const isActive = modalActiveItem === item;
  const textColor = isActive ? COLORS.neutral800 : COLORS.neutral400;

  return (
    <View style={styles.main}>
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
            {t(item)}
          </Text>
        </Row>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    paddingHorizontal: 16
  },
  container: {
    borderWidth: scale(1),
    borderColor: COLORS.neutral200,
    borderRadius: scale(16),
    marginBottom: scale(10),
    padding: scale(8),
    paddingHorizontal: scale(16),
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemInfo: {},
  itemTitle: {
    paddingLeft: scale(12)
  }
});
