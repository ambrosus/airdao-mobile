import React from 'react';
import { Row, Spacer, Text } from '@components/base';
import { View } from 'react-native';
import { styles } from '../../styles';
import { CheckBox } from '@components/base/CheckBox';
import { COLORS } from '@constants/colors';
import { ProgressArrowIcon } from '@components/svg/icons/ProgressArrow';
import { ListsOfAddressType } from '@appTypes/ListsOfAddressGroup';

type Props = {
  item: ListsOfAddressType;
  idsOfSelectedAddresses: string[];
  handleCheckBoxPress: (id: string) => void;
};
export const AddressItem = ({
  item,
  idsOfSelectedAddresses,
  handleCheckBoxPress
}: Props) => {
  return (
    <>
      <Spacer value={29} />
      <View style={styles.flatListContainer}>
        <View style={styles.whalesTokenContainer}>
          <CheckBox
            onPress={() => handleCheckBoxPress(item.addressId)}
            isChecked={idsOfSelectedAddresses.includes(item.addressId)}
          />
          <View style={styles.addressTitleContainer}>
            <Row>
              <Text
                fontFamily="Inter_600SemiBold"
                fontSize={13}
                color={COLORS.black}
              >
                {item.addressTitle}
              </Text>
              <Text
                style={styles.locationInfo}
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
};
