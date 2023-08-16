import React, { ForwardedRef, forwardRef, RefObject, useState } from 'react';
import { BottomSheet, BottomSheetRef, Header } from '@components/composite';
import { Spacer, Text } from '@components/base';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { FlatList, Platform } from 'react-native';
import { SettingsModalItem } from '@screens/Settings/components/SettingsBlock/components/SettingsModalItem';
import { styles } from '@screens/Settings/components/SettingsBlock/modals/style';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@constants/colors';
import { scale } from '@utils/scaling';
import { useTranslation } from 'react-i18next';
import useLocalization from '@contexts/Localizations';

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
  // {
  //   language: 'Arabic'
  // },
  // {
  //   language: 'Spanish'
  // },
  {
    language: 'Turkish'
  }
  // {
  //   language: 'Hindi'
  // },
  // {
  //   language: 'Portuguese'
  // },
  // {
  //   language: 'Russian'
  // },
  // {
  //   language: 'Chinese'
  // }
];

export const BottomSheetSelectLanguage = forwardRef<BottomSheetRef, Props>(
  ({ selectedLanguage, handleLanguageSave }, ref) => {
    const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [modalActiveLanguage, setModalActiveLanguage] = useState<Language>(
      selectedLanguage || ''
    );
    const { top: topInset } = useSafeAreaInsets();
    const { changeCurrentLanguage, currentLanguage } = useLocalization();

    const { t } = useTranslation();

    const onLanguagePress = (value: Language) => {
      setModalActiveLanguage(value);
      handleLanguageSave(value);
      changeCurrentLanguage(value);
    };

    return (
      <BottomSheet
        ref={localRef}
        height={'100%'}
        containerStyle={styles.bottomSheet}
      >
        {Platform.OS === 'ios' && <Spacer value={topInset} />}
        <Header
          titleStyle={styles.headerTitle}
          title={
            <Text
              fontFamily="Inter_700Bold"
              fontSize={scale(16)}
              color={COLORS.smokyBlack}
            >
              {t('select.language')}
            </Text>
          }
          titlePosition={Platform.select({ ios: 'left', default: 'center' })}
          backIconVisible={true}
          style={styles.header}
          onBackPress={() => localRef.current?.dismiss()}
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
                modalActiveItem={currentLanguage}
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
