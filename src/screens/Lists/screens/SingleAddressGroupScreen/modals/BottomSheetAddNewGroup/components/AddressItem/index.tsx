import React from 'react';
import { Row, Spacer, Text } from '@components/base';
import { View } from 'react-native';
import { styles } from '../../styles';
import { CheckBox } from '@components/base/CheckBox';
import { COLORS } from '@constants/colors';
import { ProgressArrowIcon } from '@components/svg/icons/ProgressArrow';
import { ExplorerAccount } from '@models/Explorer';

type Props = {
  item: ExplorerAccount;
  idsOfSelectedAddresses: string[];
  handleCheckBoxPress: (id: string) => void;
};
export const AddressItemWithCheckbox = ({
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
            onPress={() => handleCheckBoxPress(item.address)}
            isChecked={idsOfSelectedAddresses.includes(item.address)}
          />
          <View style={styles.addressTitleContainer}>
            <Row>
              <Text
                fontFamily="Inter_600SemiBold"
                fontSize={13}
                color={COLORS.black}
              >
                {item.name}
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
              {item.ambBalance}
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
              {/* TODO: use useAMBToken to find current price of amb and multiply by ambBalance  */}
              {item.ambBalance}
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
                {/* TODO: ExplorerAccount does not have progress  */}
                3.46
              </Text>
            </Row>
          </View>
        </View>
      </View>
    </>
  );
};
