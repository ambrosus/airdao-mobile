import React, { useEffect } from 'react';
import { View } from 'react-native';
import { BottomSheetRef } from '@components/composite';
import { Checkmark } from '@components/svg/icons';
import { Button, Spacer, Text } from '@components/base';
import { scale, verticalScale } from '@utils/scaling';
import { StringUtils } from '@utils/string';
import { useForwardedRef } from '@hooks';
import { BottomSheetEditWallet } from '../BottomSheetEditWallet';
import { useAllAddresses, useOnboardingStatus } from '@contexts';
import { useNavigation } from '@react-navigation/native';
import { WalletsNavigationProp } from '@appTypes';
import { COLORS } from '@constants/colors';
import { OnboardingView } from '../OnboardingView';
import { styles } from './styles';

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

  const { status, registerHelpers } = useOnboardingStatus((v) => v);

  const navigation = useNavigation<WalletsNavigationProp>();

  // onboarding registration
  const showEdit = async () => {
    setTimeout(() => {
      editModal.current?.show();
    }, 100);
  };

  const onDoneDuringOnboarding = () => {
    onDone();
    navigation.jumpTo('Wallets');
  };

  useEffect(() => {
    if (status === 4) {
      registerHelpers({
        next: showEdit,
        back: onDone // hide WatchlistAddSuccess
      });
    } else if (status === 11) {
      // TODO register helper for done
      registerHelpers({
        next: onDoneDuringOnboarding
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  if (!wallet)
    return (
      <View>
        <Text>Unknown Error</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Checkmark
          size={scale(96)}
          iconScale={4}
          fillColor={COLORS.jungleGreen}
          iconColor={COLORS.white}
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
          color="#51545A"
          fontFamily="Inter_400Regular"
        >
          {"Let's personalize new address! Click 'Edit Address' to get started"}
        </Text>
      </View>
      <View style={styles.buttons}>
        <OnboardingView
          thisStep={4}
          childrenAlwaysVisible
          tooltipPlacement="top"
        >
          <Button onPress={showEdit} type="circular" style={styles.editButton}>
            <Text title color="#FFFFFF" fontFamily="Inter_600SemiBold">
              Edit Address
            </Text>
          </Button>
        </OnboardingView>
        <Spacer value={verticalScale(24)} />
        <OnboardingView
          thisStep={11}
          childrenAlwaysVisible
          tooltipPlacement="top"
        >
          <Button
            onPress={onDone}
            type="circular"
            style={{
              ...styles.button,
              backgroundColor: COLORS.charcoal
            }}
          >
            <Text
              title
              fontFamily="Inter_600SemiBold"
              color={COLORS.smokyBlack}
            >
              Done
            </Text>
          </Button>
        </OnboardingView>
      </View>
      <BottomSheetEditWallet ref={editModal} wallet={wallet} />
    </View>
  );
};
