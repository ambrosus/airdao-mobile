import React from 'react';
import { View } from 'react-native';
import { BottomSheetRef } from '@components/composite';
import { Checkmark } from '@components/svg/icons';
import { Button, Spacer, Text } from '@components/base';
import { scale, verticalScale } from '@utils/scaling';
import { StringUtils } from '@utils/string';
import { useForwardedRef } from '@hooks';
import { BottomSheetEditWallet } from '../BottomSheetEditWallet';
import { styles } from './styles';
import { useAllAddresses } from '@contexts';

interface WatchlistAddSuccessProps {
  address: string;
  onDone: () => unknown;
}

export const WatchlistAddSuccess = (
  props: WatchlistAddSuccessProps
): JSX.Element => {
  const { address, onDone } = props;
  const allAddresses = useAllAddresses();
  const wallet = allAddresses.find((w) => w.address === address);
  const editModal = useForwardedRef<BottomSheetRef>(null);

  if (!wallet)
    return (
      <View>
        <Text>Unknown Error</Text>
      </View>
    );

  const showEdit = () => {
    editModal.current?.show();
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Checkmark
          size={scale(96)}
          iconScale={4}
          fillColor="#BFBFBF"
          iconColor="#FFFFFF"
        />
        <Spacer value={verticalScale(49)} />
        <Text
          align="center"
          fontSize={17}
          fontWeight="600"
          color="#000000"
          fontFamily="Inter_700Bold"
        >
          You are on a roll!
          {`\n${StringUtils.formatAddress(
            wallet.address,
            11,
            5
          )} has been added to your watchlist.`}
        </Text>
        <Spacer value={verticalScale(11)} />
        <Text
          align="center"
          fontWeight="400"
          fontSize={13}
          color="#646464"
          fontFamily="Inter_400Regular"
        >
          {"Let's personalize new address! Click 'Edit Address' to get started"}
        </Text>
      </View>
      <View style={styles.buttons}>
        <Button
          onPress={showEdit}
          type="circular"
          style={{ ...styles.button, backgroundColor: '#676B73' }}
        >
          <Text title color="#FFFFFF" fontFamily="Inter_600SemiBold">
            Edit Address
          </Text>
        </Button>
        <Spacer value={verticalScale(24)} />
        <Button
          onPress={onDone}
          type="circular"
          style={{ ...styles.button, backgroundColor: '#0e0e0e0d' }}
        >
          <Text title fontFamily="Inter_600SemiBold">
            Done
          </Text>
        </Button>
      </View>
      <BottomSheetEditWallet wallet={wallet} />
    </View>
  );
};
