import React, {
  ForwardedRef,
  forwardRef,
  RefObject,
  useCallback,
  useRef,
  useState
} from 'react';
import { BottomSheet, Header, Slider } from '@components/composite';
import { BottomSheetRef } from '@components/composite/BottomSheet/BottomSheet.types';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { Button, Row, Text } from '@components/base';
import { Switch, View } from 'react-native';
import { COLORS } from '@constants/colors';
import { Spacer } from '@components/base/Spacer';
import { CloseIcon } from '@components/svg/icons/Close';
import { InfoIcon } from '@components/svg/icons/Info';
import { RightArrowIcon } from '@components/svg/icons';
import { BottomSheetSelectList } from '@screens/Portfolio/components/BottomSheetListsSettings/components/BottomSheetSelectList';
import { styles } from '@screens/Portfolio/components/BottomSheetListsSettings/styles';

type Props = {
  ref: RefObject<BottomSheetRef>;
};
export const BottomSheetListsSettings = forwardRef<BottomSheetRef, Props>(
  (props, ref) => {
    const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
    const [isTransactionAlertsEnabled, setIsTransactionAlertsEnabled] =
      useState(false);
    const [isPercentChangeEnabled, setIsPercentChangeEnabled] = useState(false);
    const listSettingsRef = useRef<BottomSheetRef>(null);
    const handleOpenListSettings = useCallback(() => {
      listSettingsRef.current?.show();
    }, []);
    const toggleTransactionAlertsSwitch = () =>
      setIsTransactionAlertsEnabled((previousState) => !previousState);
    const togglePercentChangeSwitch = () =>
      setIsPercentChangeEnabled((previousState) => !previousState);
    return (
      <>
        <BottomSheet height={800} ref={localRef}>
          <Header
            style={styles.header}
            title="List settings"
            titlePosition="center"
            backIconVisible={false}
            contentLeft={
              <Button type="base" onPress={() => localRef.current?.dismiss()}>
                <CloseIcon />
              </Button>
            }
            contentRight={
              <Button type="base" onPress={() => localRef.current?.dismiss()}>
                <Text
                  fontFamily="Inter_600SemiBold"
                  color={COLORS.lightGrey}
                  fontSize={16}
                >
                  Save
                </Text>
              </Button>
            }
          />
          <View style={styles.container}>
            <Text
              fontFamily="Inter_600SemiBold"
              color={COLORS.smokyBlack}
              fontSize={20}
            >
              Notifications
            </Text>
            <Spacer value={6} />
            <Text
              fontFamily="Inter_400Regular"
              color={COLORS.lightGrey}
              fontSize={15}
            >
              Toggle which notifications you want to receive
            </Text>
            <Spacer value={20} />
            <Row justifyContent="space-between" alignItems="center">
              <Text
                fontFamily="Inter_600SemiBold"
                fontSize={16}
                color={COLORS.smokyBlack}
              >
                Transaction alerts
              </Text>
              <Button type="base">
                <Switch
                  trackColor={{ false: COLORS.silver, true: COLORS.lightGrey }}
                  thumbColor="white"
                  ios_backgroundColor={COLORS.silver}
                  onValueChange={toggleTransactionAlertsSwitch}
                  value={isTransactionAlertsEnabled}
                />
              </Button>
            </Row>
            <Spacer value={29} />
            <Row alignItems="center">
              <Text
                style={styles.infoContainer}
                fontFamily="Inter_600SemiBold"
                fontSize={16}
                color={COLORS.smokyBlack}
              >
                Set treshold
              </Text>
              <InfoIcon />
            </Row>
            <Spacer value={24} />
            <View style={styles.slider}>
              <Slider
                width={320}
                minValue={0}
                maxValue={100}
                isSecondPointVisible={true}
              />
            </View>
            <Spacer value={45} />
            <View style={styles.separator} />
            <Spacer value={25} />
            <Row justifyContent="space-between" alignItems="center">
              <Row alignItems="center">
                <Text
                  style={styles.infoContainer}
                  fontFamily="Inter_600SemiBold"
                  fontSize={16}
                  color={COLORS.smokyBlack}
                >
                  % Change in value
                </Text>
                <InfoIcon />
              </Row>
              <Button type="base">
                <Switch
                  trackColor={{ false: COLORS.silver, true: COLORS.lightGrey }}
                  thumbColor={isPercentChangeEnabled ? 'white' : 'white'}
                  ios_backgroundColor={COLORS.silver}
                  onValueChange={togglePercentChangeSwitch}
                  value={isPercentChangeEnabled}
                />
              </Button>
            </Row>
            <Spacer value={24} />
            <View style={styles.slider}>
              <Slider
                width={320}
                minValue={0}
                maxValue={100}
                isSecondPointVisible={false}
              />
            </View>
            <Spacer value={45} />
            <View style={styles.separator} />
            <Spacer value={25} />
            <Text
              fontFamily="Inter_400Regular"
              fontSize={15}
              color={COLORS.grey}
            >
              Select lists you want to receive notifications on
            </Text>
            <Spacer value={24} />
            <Row alignItems="center" justifyContent="space-between">
              <Text
                style={styles.infoContainer}
                fontFamily="Inter_600SemiBold"
                fontSize={16}
                color={COLORS.smokyBlack}
              >
                Select List
              </Text>
              <Button type="base" onPress={handleOpenListSettings}>
                <Row alignItems="center" justifyContent="space-between">
                  <Text
                    style={styles.infoContainer}
                    fontFamily="Inter_600SemiBold"
                    fontSize={13}
                    color={COLORS.grey}
                  >
                    Whales, Private, Losers
                  </Text>
                  <RightArrowIcon />
                </Row>
              </Button>
            </Row>
          </View>
          <BottomSheetSelectList ref={listSettingsRef} />
        </BottomSheet>
      </>
    );
  }
);
