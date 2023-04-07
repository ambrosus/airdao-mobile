import React, { ForwardedRef, forwardRef, RefObject, useState } from 'react';
import { BottomSheet, BottomSheetRef, Header } from '@components/composite';
import { Button, Input, Row, Spacer, Text } from '@components/base';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { styles } from './styles';
import { CloseIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { AddIcon } from '@components/svg/icons/AddIcon';
import { FloatButton } from '@components/base/FloatButton';
import { FlatList, View } from 'react-native';
import { ProgressArrowIcon } from '@components/svg/icons/ProgressArrow';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamsList } from '@navigation/stacks/RootStack';
import { CheckBox } from '@components/base/CheckBox';

type Props = {
  ref: RefObject<BottomSheetRef>;
};

export const BottomSheetAddNewGroup = forwardRef<BottomSheetRef, Props>(
  (props, ref) => {
    const localRef: ForwardedRef<BottomSheetRef> = useForwardedRef(ref);

    const [toggleCheckBox, setToggleCheckBox] = useState(false);

    const {
      params: {
        group: { listOfAddresses }
      }
    } = useRoute<RouteProp<RootStackParamsList, 'SingleAddressGroup'>>();

    return (
      <>
        <BottomSheet ref={localRef} height={800}>
          <Header
            title="Add from watchlists"
            titlePosition="center"
            style={styles.header}
            backIconVisible={false}
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
                }}
              >
                <Text
                  fontFamily="Inter_600SemiBold"
                  color={COLORS.lightGrey}
                  fontSize={16}
                >
                  Add to list
                </Text>
              </Button>
            }
          />
          <Input
            type="text"
            placeholder="Search watchlist"
            placeholderTextColor="#2f2b4399"
            style={[styles.bottomSheetInput]}
            value=""
            onChangeValue={() => null}
          />
          <FloatButton
            title="Track new Address"
            icon={<AddIcon />}
            bottomPadding={0}
            onPress={() => null}
          />
          <FlatList
            contentContainerStyle={{
              paddingBottom: 150
            }}
            data={listOfAddresses}
            renderItem={({ item }) => {
              return (
                <>
                  <Spacer value={29} />
                  <View style={styles.flatListContainer}>
                    <View style={styles.whalesTokenContainer}>
                      <CheckBox
                        onPress={() => setToggleCheckBox(!toggleCheckBox)}
                        isChecked={toggleCheckBox}
                      />
                      <View style={styles.infoContainer}>
                        <Row>
                          <Text
                            fontFamily="Inter_600SemiBold"
                            fontSize={13}
                            color={COLORS.black}
                          >
                            {item.addressTitle}
                          </Text>
                          <Text
                            fontFamily="Inter_600SemiBold"
                            fontSize={13}
                            color={COLORS.thinGrey}
                          >
                            ~ Whales list
                          </Text>
                        </Row>
                        <Spacer value={4} />
                        <Text
                          fontFamily="Mersad_600SemiBold"
                          fontSize={13}
                          color={COLORS.thinGrey}
                        >
                          {item.addressToken}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.priceProgressContainer}>
                      <View style={styles.infoContainer}>
                        <Text
                          fontFamily="Mersad_600SemiBold"
                          fontSize={13}
                          color={COLORS.black}
                        >
                          {item.addressPrice}
                        </Text>
                        <Spacer value={4} />
                        <Row justifyContent="space-between" alignItems="center">
                          <ProgressArrowIcon />
                          <Text
                            fontFamily="Mersad_600SemiBold"
                            fontSize={12}
                            color={COLORS.thinGrey}
                            style={styles.progressIcon}
                          >
                            {item.addressProgress}
                          </Text>
                        </Row>
                      </View>
                    </View>
                  </View>
                </>
              );
            }}
          />
        </BottomSheet>
      </>
    );
  }
);
