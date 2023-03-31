import React, {
  ForwardedRef,
  forwardRef,
  RefObject,
  useCallback,
  useRef,
  useState
} from 'react';
import { BottomSheet, Slider } from '@components/composite';
import { BottomSheetRef } from '@components/composite/BottomSheet/BottomSheet.types';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { Button, Row, Text } from '@components/base';
import { StyleSheet, Switch, View } from 'react-native';
import { COLORS } from '@constants/colors';
import { Spacer } from '@components/base/Spacer';
import { CloseIcon } from '@components/svg/icons/Close';
import { InfoIcon } from '@components/svg/icons/Info';
import { MultiRangeSlider } from '@screens/Lists/components/BottomSheetFilters/components/MultiSlider';
import { RightArrowIcon } from '@components/svg/RightArrowIcon';
import { BottomSheetSelectList } from '@screens/Lists/components/BottomSheetListSettings/components/BottomSheetSelectList';

type Props = {
  ref: RefObject<BottomSheetRef>;
};
export const BottomSheetListSettings = forwardRef<BottomSheetRef, Props>(
  (props, ref) => {
    const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);
    const [isEnabled, setIsEnabled] = useState(false);
    const listSettingsRef = useRef<BottomSheetRef>(null);
    const handleOpenListSettings = useCallback(() => {
      listSettingsRef.current?.show();
    }, []);
    const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
    return (
      <>
        <BottomSheet height={800} ref={localRef}>
          <View style={styles.container}>
            <Row justifyContent="space-between" alignItems="center">
              <Button type="base" onPress={() => localRef.current?.dismiss()}>
                <CloseIcon />
              </Button>
              <Text
                fontFamily="Inter_600SemiBold"
                fontSize={15}
                color={COLORS.black}
              >
                List settings
              </Text>
              <Button type="base" onPress={() => localRef.current?.dismiss()}>
                <Text
                  fontFamily="Inter_600SemiBold"
                  color={COLORS.lightGrey}
                  fontSize={16}
                >
                  Save
                </Text>
              </Button>
            </Row>
            <Spacer value={39} />
            <Text
              fontFamily="Inter_600SemiBold"
              color={COLORS.black}
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
                color={COLORS.black}
              >
                Transaction alerts
              </Text>
              <Button>
                <Switch
                  trackColor={{ false: COLORS.silver, true: COLORS.lightGrey }}
                  thumbColor={isEnabled ? 'white' : 'white'}
                  ios_backgroundColor={COLORS.silver}
                  onValueChange={toggleSwitch}
                  value={isEnabled}
                />
              </Button>
            </Row>
            <Spacer value={29} />
            <Row alignItems="center">
              <Text
                style={styles.infoContainer}
                fontFamily="Inter_600SemiBold"
                fontSize={16}
                color={COLORS.black}
              >
                Set treshold
              </Text>
              <InfoIcon />
            </Row>
            <MultiRangeSlider />
            <View style={styles.sliderTextContainer}>
              <Text style={styles.sliderText}>MIN</Text>
              <Text style={styles.sliderText}>MAX</Text>
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
                  color={COLORS.black}
                >
                  % Change in value
                </Text>
                <InfoIcon />
              </Row>
              <Button>
                <Switch
                  trackColor={{ false: COLORS.silver, true: COLORS.lightGrey }}
                  thumbColor={isEnabled ? 'white' : 'white'}
                  ios_backgroundColor={COLORS.silver}
                  onValueChange={toggleSwitch}
                  value={isEnabled}
                />
              </Button>
            </Row>
            <Spacer value={24} />
            <View style={styles.singleMarkerSlider}>
              <Slider width={320} minValue={0} maxValue={100} />
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
                color={COLORS.black}
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

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingLeft: 17,
    marginRight: 20
  },
  sliderText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    justifyContent: 'flex-start',
    color: COLORS.silver
  },
  sliderTextContainer: {
    marginTop: -40,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.silver,
    width: '100%'
  },
  infoContainer: {
    paddingRight: 12
  },
  singleMarkerSlider: {
    alignItems: 'center'
  }
});
