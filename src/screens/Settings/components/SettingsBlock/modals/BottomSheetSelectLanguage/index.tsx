import React, { ForwardedRef, forwardRef, RefObject, useState } from 'react';
import { BottomSheet, BottomSheetRef, Header } from '@components/composite';
import { Button, Spacer } from '@components/base';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { Dimensions, FlatList } from 'react-native';
import { BackIcon } from '@components/svg/icons';
import { SettingsModalItem } from '@screens/Settings/components/SettingsBlock/components/SettingsModalItem';
import { styles } from '@screens/Settings/components/SettingsBlock/modals/style';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
    const { top: topInset } = useSafeAreaInsets();

    const onLanguagePress = (value: Language) => {
      setModalActiveLanguage(value);
      handleLanguageSave(value);
    };

    return (
      <BottomSheet
        ref={localRef}
        height={Dimensions.get('screen').height}
        containerStyle={styles.bottomSheet}
      >
        <Spacer value={topInset} />
        <Header
          titleStyle={styles.headerTitle}
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
              <BackIcon />
            </Button>
          }
        />
        <Spacer value={19} />
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
      </BottomSheet>
    );
  }
);
