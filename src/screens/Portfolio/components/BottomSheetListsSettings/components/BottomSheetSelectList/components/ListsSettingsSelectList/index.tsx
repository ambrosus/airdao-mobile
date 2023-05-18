import React, { FC, useState } from 'react';
import { View } from 'react-native';
import { Text } from '@components/base';
import { Spacer } from '@components/base/Spacer';
import { CheckBox } from '@components/composite';
import { COLORS } from '@constants/colors';
import { styles } from '@screens/Portfolio/components/BottomSheetListsSettings/components/BottomSheetSelectList/components/ListsSettingsSelectList/styles';

type Props = {
  item: {
    title: string;
    wallets: string;
  };
};

export const ListsSettingsSelectList: FC<Props> = ({ item }) => {
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  return (
    <View style={styles.container}>
      <View style={styles.itemInfo}>
        <Text
          fontFamily="Inter_600SemiBold"
          fontSize={17}
          color={COLORS.smokyBlack}
          style={styles.itemTitle}
        >
          {item.title}
        </Text>
        <Spacer value={4} />
        <View style={styles.itemSubInfo}>
          <Text
            fontFamily="Inter_400Regular"
            fontSize={16}
            color={COLORS.smokyBlack}
            style={styles.walletsCount}
          >
            {item.wallets}
          </Text>
        </View>
      </View>
      <CheckBox
        onValueChange={() => setToggleCheckBox(!toggleCheckBox)}
        type="square"
        fillColor={COLORS.sapphireBlue}
        color={COLORS.white}
        value={toggleCheckBox}
      />
    </View>
  );
};
