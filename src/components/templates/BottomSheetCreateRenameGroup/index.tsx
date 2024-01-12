import React, {
  ForwardedRef,
  forwardRef,
  RefObject,
  useCallback,
  useRef,
  useState
} from 'react';
import { Platform, View } from 'react-native';
import { Spacer } from '@components/base/Spacer';
import { Button, Input, InputRef, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { BottomSheetRef } from '@components/composite/BottomSheet/BottomSheet.types';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { styles } from '@components/templates/BottomSheetCreateRenameGroup/styles';
import {
  PrimaryButton,
  Toast,
  ToastPosition,
  ToastType
} from '@components/modular';
import { OnboardingView } from '../OnboardingView';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { verticalScale } from '@utils/scaling';
import { StringUtils } from '@utils/string';
import { useTranslation } from 'react-i18next';
import { BottomSheet } from '@components/composite';

type Props = {
  ref: RefObject<BottomSheetRef>;
  handleOnRenameGroup?: (selectedListId: string, newListName: string) => void;
  handleOnCreateGroup?: (value: string) => void;
  groupTitle?: string;
  groupId?: string;
  type: 'rename' | 'create';
};
export const BottomSheetCreateRenameGroup = forwardRef<BottomSheetRef, Props>(
  (props, ref) => {
    const {
      handleOnRenameGroup,
      groupTitle,
      type = 'create',
      handleOnCreateGroup,
      groupId
    } = props;

    const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
    const { t } = useTranslation();
    const nameInput = useRef<InputRef>(null);
    const [localGroupName, setLocalGroupName] = useState<string>('');

    const [emptyPlaceholder, setEmptyPlaceholder] = useState(false);

    // onboarding functions
    const setDemoName = () => {
      nameInput.current?.setText('Demo group');
      setLocalGroupName('Demo Group');
    };

    // end of onboarding functions

    const handleButtonPress = useCallback(() => {
      if (!localGroupName) {
        setEmptyPlaceholder(true);
        return;
      }
      setEmptyPlaceholder(false);
      localRef.current?.dismiss();
      setTimeout(() => {
        // Proceed with form submission
        if (handleOnCreateGroup) {
          handleOnCreateGroup(localGroupName);
          Toast.show({
            text: t('toast.group.created', {
              name: StringUtils.formatAddress(localGroupName, 16, 0)
            }),
            position: ToastPosition.Top,
            type: ToastType.Success
          });
        }

        if (handleOnRenameGroup && groupId) {
          handleOnRenameGroup(groupId, localGroupName);
          Toast.show({
            text: t('toast.group.renamed', {
              oldName: StringUtils.formatAddress(groupTitle || '', 16, 0),
              newName: StringUtils.formatAddress(localGroupName, 16, 0)
            }),
            position: ToastPosition.Top,
            type: ToastType.Success
          });
        }

        setLocalGroupName('');
      }, 500);
      // setTimeout(() => localRef.current?.dismiss(), 400);
    }, [
      groupId,
      groupTitle,
      handleOnCreateGroup,
      handleOnRenameGroup,
      localGroupName,
      localRef,
      t
    ]);

    const bottomSafeArea = useSafeAreaInsets().bottom - 10;

    const handleDismiss = useCallback(() => {
      setLocalGroupName('');
      setEmptyPlaceholder(false);
    }, []);

    return (
      <BottomSheet
        height={
          Platform.OS === 'ios'
            ? Math.min(verticalScale(365), 320)
            : Math.min(verticalScale(380), 330)
        }
        ref={localRef}
        containerStyle={
          Platform.OS === 'android' && { marginBottom: bottomSafeArea }
        }
        onClose={handleDismiss}
        testID="Create_Rename_Collection_BottomSheet"
        swiperIconVisible
      >
        <View testID="BottomSheetCreateRename" style={styles.container}>
          <View style={styles.content}>
            <Spacer value={24} />
            <Text
              testID="BottomSheetCreateRename_Title"
              style={styles.newListTitle}
              fontFamily="Inter_600SemiBold"
              fontSize={16}
              color={COLORS.neutral900}
            >
              {type === 'create'
                ? t('collection.create')
                : t('collection.rename')}
            </Text>
            <Spacer value={8} />
            <OnboardingView
              thisStep={8}
              tooltipPlacement="bottom"
              childrenAlwaysVisible
              helpers={{ next: setDemoName, back: localRef.current?.dismiss }}
            >
              <Input
                testID="BottomSheetCreateRename_Input"
                ref={nameInput}
                value={localGroupName}
                onChangeValue={setLocalGroupName}
                type="text"
                placeholder={
                  emptyPlaceholder
                    ? t('common.field.required')
                    : t('collection.name.input.placeholder')
                }
                placeholderTextColor={
                  emptyPlaceholder ? COLORS.error400 : COLORS.alphaBlack60
                }
                style={[styles.bottomSheetInput]}
              />
            </OnboardingView>
            <Spacer value={24} />
            <OnboardingView
              thisStep={9}
              tooltipPlacement="bottom"
              childrenAlwaysVisible
              helpers={{ next: handleButtonPress }}
            >
              <PrimaryButton
                testID="BottomSheetCreateRename_Button"
                onPress={handleButtonPress}
                disabled={!Boolean(localGroupName)}
              >
                <Text
                  fontFamily="Inter_600SemiBold"
                  fontSize={16}
                  color={
                    Boolean(localGroupName)
                      ? COLORS.neutral0
                      : COLORS.alphaBlack30
                  }
                >
                  {type === 'create' ? t('button.create') : t('button.save')}
                </Text>
              </PrimaryButton>
            </OnboardingView>
            <Spacer value={24} />
            <Button
              testID="BottomSheetCreateRename_Cancel_Button"
              type="base"
              style={styles.bottomSheetCancelButton}
              onPress={() => {
                setTimeout(() => {
                  localRef.current?.dismiss();
                }, 400);
              }}
            >
              <Text
                fontFamily="Inter_600SemiBold"
                fontWeight="600"
                color={COLORS.neutral900}
                fontSize={16}
              >
                {t('button.cancel')}
              </Text>
            </Button>
          </View>
        </View>
      </BottomSheet>
    );
  }
);
