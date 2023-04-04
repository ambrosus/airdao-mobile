import React, { ForwardedRef, forwardRef, RefObject, useState } from 'react';
import { BottomSheet, BottomSheetRef } from '@components/composite';
import { Button, Row, Spacer, Text } from '@components/base';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { FlatList, StyleSheet, View } from 'react-native';
import { CloseIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { SettingsModalItem } from '@screens/Settings/components/SettingsBlock/components/SettingsModalItem';

type Props = {
  ref: RefObject<BottomSheetRef>;
  handleLanguageSave: (value: Language) => void;
  selectedLanguage: Language;
};

export type Language =
  | 'English'
  | 'Arabic'
  | 'Spanish'
  | 'Turkish'
  | 'Chinese'
  | 'Russian'
  | 'Portuguese'
  | 'Hindi';

type LanguageData = {
  language: Language;
};

const mockedLanguages: LanguageData[] = [
  {
    language: 'English'
  },
  {
    language: 'Arabic'
  },
  {
    language: 'Spanish'
  },
  {
    language: 'Turkish'
  },
  {
    language: 'Hindi'
  },
  {
    language: 'Portuguese'
  },
  {
    language: 'Russian'
  },
  {
    language: 'Chinese'
  }
];

export const BottomSheetSelectLanguage = forwardRef<BottomSheetRef, Props>(
  ({ selectedLanguage, handleLanguageSave }, ref) => {
    const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
    const [modalActiveLanguage, setModalActiveLanguage] = useState<Language>(
      selectedLanguage || ''
    );

    const onLanguagePress = (value: Language) => {
      setModalActiveLanguage(value);
    };

    return (
      <BottomSheet ref={localRef} height={852}>
        <View style={styles.container}>
          <Row justifyContent="space-between" alignItems="center">
            <Button type="base" onPress={() => localRef.current?.dismiss()}>
              <View style={{ width: 38 }}>
                <CloseIcon />
              </View>
            </Button>
            <Text
              fontFamily="Inter_600SemiBold"
              fontSize={15}
              color={COLORS.black}
            >
              Select language
            </Text>
            <Button
              type="base"
              onPress={() => {
                localRef.current?.dismiss();
                handleLanguageSave(modalActiveLanguage);
              }}
            >
              <Text
                fontFamily="Inter_600SemiBold"
                color={COLORS.lightGrey}
                fontSize={16}
              >
                Save
              </Text>
            </Button>
          </Row>
          <Spacer value={40} />
        </View>
        <View>
          <FlatList
            contentContainerStyle={{
              paddingBottom: 150
            }}
            data={mockedLanguages}
            renderItem={({ item, index }) => {
              return (
                <SettingsModalItem
                  modalActiveItem={modalActiveLanguage}
                  item={item.language}
                  handleItemPress={onLanguagePress}
                  key={index}
                />
              );
            }}
          />
        </View>
      </BottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingHorizontal: 20
  }
});
