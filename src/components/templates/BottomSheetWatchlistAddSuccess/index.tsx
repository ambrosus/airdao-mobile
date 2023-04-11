import React, { forwardRef, useRef } from 'react';
import { View } from 'react-native';
import { BottomSheetProps, BottomSheetRef } from '@components/composite';
import { Checkmark } from '@components/svg/icons';
import { BottomSheetWithHeader } from '@components/modular';
import { Button, Spacer, Text } from '@components/base';
import { EditAddress } from '../EditAddress';
import { scale, verticalScale } from '@utils/scaling';
import { StringUtils } from '@utils/string';
import { useForwardedRef } from '@hooks/useForwardedRef';
import { ListsOfAddressType } from '@appTypes/ListsOfAddressGroup';
import { styles } from './styles';

interface BottomSheetWatchlistAddSuccessProps extends BottomSheetProps {
  address: ListsOfAddressType;
}

export const BottomSheetWatchlistAddSuccess = forwardRef<
  BottomSheetRef,
  BottomSheetWatchlistAddSuccessProps
>((props, ref) => {
  const { address, ...bottomSheetProps } = props;
  const localRef = useForwardedRef<BottomSheetRef>(ref);
  const editModal = useRef<BottomSheetRef>(null);

  const dismissWatchlist = () => {
    localRef.current?.dismiss();
  };

  const showEdit = () => {
    editModal.current?.show();
  };

  return (
    <BottomSheetWithHeader
      ref={localRef}
      fullscreen
      {...bottomSheetProps}
      title=""
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <Checkmark
            size={scale(96)}
            iconScale={4}
            fillColor="#BFBFBF"
            iconColor="#FFFFFF"
          />
          <Spacer value={verticalScale(49)} />
          <Text align="center" fontSize={17} fontWeight="600" color="#000000">
            You are on a roll!
            {`\n${StringUtils.formatAddress(
              address.addressToken,
              11,
              5
            )} has been added to your watchlist.`}
          </Text>
          <Spacer value={verticalScale(11)} />
          <Text align="center" fontWeight="400" fontSize={13} color="#646464">
            {
              "Let's personalize new address! Click 'Edit Address' to get started"
            }
          </Text>
        </View>
        <View style={styles.buttons}>
          <Button
            onPress={showEdit}
            type="circular"
            style={{ ...styles.button, backgroundColor: '#676B73' }}
          >
            <Text title color="#FFFFFF">
              Edit Address
            </Text>
          </Button>
          <Spacer value={verticalScale(24)} />
          <Button
            onPress={dismissWatchlist}
            type="circular"
            style={{ ...styles.button, backgroundColor: '#0e0e0e0d' }}
          >
            <Text title>Done</Text>
          </Button>
        </View>
        <BottomSheetWithHeader
          title="Edit Address"
          ref={editModal}
          fullscreen
          avoidKeyboard={false}
        >
          <EditAddress address={address} />
        </BottomSheetWithHeader>
      </View>
    </BottomSheetWithHeader>
  );
});
