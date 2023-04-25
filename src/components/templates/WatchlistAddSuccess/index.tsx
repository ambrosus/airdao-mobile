import React, { useEffect, useState } from 'react';
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
import Tooltip from 'react-native-walkthrough-tooltip';
import { OnBoardingToolTipBody } from '@components/composite/OnBoardingToolTip/OnBoardingToolTipBody';
import { useOnboardingToolTip } from '@hooks/useOnboardingToolTip';
import { OnBoardingStatus } from '@components/composite/OnBoardingToolTip/OnBoardingToolTip.types';
import { useOnboardingStatus } from '@contexts/OnBoardingUserContext';

interface WatchlistAddSuccessProps {
  address: string;
  onDone: () => unknown;
  status: OnBoardingStatus;
  handleSuccessModalClose?: () => void;
}

export const WatchlistAddSuccess = (
  props: WatchlistAddSuccessProps
): JSX.Element => {
  const { address, onDone, handleSuccessModalClose = () => null } = props;
  const allAddresses = useAllAddresses();
  const wallet = allAddresses.find((w) => w.address === address);
  const editModal = useForwardedRef<BottomSheetRef>(null);

  const { status, handleStepChange } = useOnboardingStatus((v) => v);
  const [isToolTipVisible, setIsToolTipVisible] = useState<boolean>(false);
  const {
    title,
    subtitle,
    buttonRightTitle,
    buttonLeftTitle,
    isButtonLeftVisible
  } = useOnboardingToolTip(status);

  useEffect(() => {
    setTimeout(() => setIsToolTipVisible(true), 500);
  }, []);

  if (!wallet)
    return (
      <View>
        <Text>Unknown Error</Text>
      </View>
    );

  const showEdit = () => {
    handleStepChange('step-5');
    editModal.current?.show();
    setIsToolTipVisible(false);
  };

  const handleOnboardingSuccessStepChange = (type: 'back' | 'next') => {
    handleStepChange(type === 'back' ? 'step-4' : 'step-5');
    setIsToolTipVisible(false);
    if (type === 'back') {
      setTimeout(() => {
        handleSuccessModalClose();
      }, 500);
    }
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
        <Tooltip
          tooltipStyle={{ flex: 1 }}
          contentStyle={{ height: 136, borderRadius: 8 }}
          arrowSize={{ width: 16, height: 8 }}
          backgroundColor="rgba(0,0,0,0.5)"
          isVisible={isToolTipVisible}
          content={
            <OnBoardingToolTipBody
              title={title}
              buttonRightTitle={buttonRightTitle}
              subtitle={subtitle}
              buttonLeftTitle={buttonLeftTitle}
              handleButtonLeftPress={() =>
                handleOnboardingSuccessStepChange('back')
              }
              handleButtonRightPress={() =>
                handleOnboardingSuccessStepChange('next')
              }
              isButtonLeftVisible={isButtonLeftVisible}
            />
          }
          placement="top"
          onClose={() => null}
        >
          <Button
            onPress={showEdit}
            type="circular"
            style={{
              ...styles.button,
              backgroundColor: '#676B73',
              borderWidth: 1,
              borderColor: 'white'
            }}
          >
            <Text title color="#FFFFFF" fontFamily="Inter_600SemiBold">
              Edit Address
            </Text>
          </Button>
        </Tooltip>
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
      <BottomSheetEditWallet ref={editModal} wallet={wallet} />
    </View>
  );
};
