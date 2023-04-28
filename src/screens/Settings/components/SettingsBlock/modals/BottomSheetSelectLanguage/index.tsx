import React, { ForwardedRef, forwardRef, RefObject, useState } from 'react';
import { BottomSheet, BottomSheetRef, Header } from '@components/composite';
import { Button, Spacer, Text } from '@components/base';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { FlatList, View } from 'react-native';
import { CloseIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { SettingsModalItem } from '@screens/Settings/components/SettingsBlock/components/SettingsModalItem';
import { styles } from '@screens/Settings/components/SettingsBlock/modals/style';

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
        <Header
          title="Select language"
          titlePosition="center"
          backIconVisible={false}
          style={styles.header}
          contentLeft={
            <Button
              type="base"
              onPress={() => {
                localRef.current?.dismiss();
              }}
            >
              <CloseIcon />
            </Button>
          }
          contentRight={
            <Button
              type="base"
              onPress={() => {
                localRef.current?.dismiss();
                handleLanguageSave(modalActiveLanguage);
              }}
            >
              <Text
                fontFamily="Inter_600SemiBold"
                color={COLORS.jungleGreen}
                fontSize={16}
              >
                Save
              </Text>
            </Button>
          }
        />
        <Spacer value={40} />
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
