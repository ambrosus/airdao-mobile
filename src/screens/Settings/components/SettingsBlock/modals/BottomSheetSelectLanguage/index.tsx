import React, { ForwardedRef, forwardRef, RefObject, useState } from 'react';
import { BottomSheet, BottomSheetRef, Header } from '@components/composite';
import { Button, Spacer, Text } from '@components/base';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { Dimensions, FlatList, Platform, View } from 'react-native';
import { BackIcon, CloseIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { SettingsModalItem } from '@screens/Settings/components/SettingsBlock/components/SettingsModalItem';
import { styles } from '@screens/Settings/components/SettingsBlock/modals/style';
import { FloatButton } from '@components/base/FloatButton';
import { scale } from '@utils/scaling';

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
      <BottomSheet
        ref={localRef}
        height={Platform.OS === 'ios' ? 852 : Dimensions.get('screen').height}
      >
        {Platform.OS === 'android' && <Spacer value={scale(57)} />}
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
              {Platform.OS === 'ios' ? <CloseIcon /> : <BackIcon />}
            </Button>
          }
          contentRight={
            <>
              {Platform.OS === 'ios' && (
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
              )}
            </>
          }
        />
        {Platform.OS === 'android' && <Spacer value={19} />}
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
        {Platform.OS === 'android' && (
          <FloatButton
            title="Save"
            onPress={() => {
              localRef.current?.dismiss();
              handleLanguageSave(modalActiveLanguage);
            }}
            bottomPadding={17}
          />
        )}
      </BottomSheet>
    );
  }
);
