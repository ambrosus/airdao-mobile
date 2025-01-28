import { ForwardedRef, forwardRef, RefObject, useState } from 'react';
import { FlatList, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Language } from '@appTypes';
import { Spacer, Text } from '@components/base';
import { BottomSheet, BottomSheetRef, Header } from '@components/composite';
import { COLORS } from '@constants/colors';
import useLocalization from '@contexts/Localizations';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { SettingsModalItem } from '@screens/Settings/screens/AppPreferences/components/modals/SettingsModalItem/SettingsModalItem';
import { LocalizationUtils, scale } from '@utils';
import { styles } from '../style';

type Props = {
  ref: RefObject<BottomSheetRef>;
  handleLanguageSave: (value: Language) => void;
  selectedLanguage: Language;
};

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
          bottomBorder
          titleStyle={styles.headerTitle}
          title={
            <Text
              fontFamily="Inter_700Bold"
              fontSize={scale(16)}
              color={COLORS.neutral900}
            >
              {t('settings.preferences.language')}
            </Text>
          }
          titlePosition={'center'}
          backIconVisible={true}
          style={styles.header}
          onBackPress={() => localRef.current?.dismiss()}
        />
        <Spacer value={19} />
        <FlatList
          contentContainerStyle={styles.list}
          data={mockedLanguages}
          renderItem={({ item, index }) => {
            return (
              <SettingsModalItem
                modalActiveItem={LocalizationUtils.languageFromCode(
                  currentLanguage
                )}
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
