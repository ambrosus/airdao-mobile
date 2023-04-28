import React, { SetStateAction } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { WalletsNavigationProp } from '@appTypes';

interface WatchlistAddSuccessProps {
  address: string;
  onDone: () => unknown;
  status: OnBoardingStatus;
  handleSuccessModalClose?: () => void;
  isEditToolTipVisible?: boolean;
  setIsEditToolTipVisible?: React.Dispatch<SetStateAction<boolean>>;
  isDoneToolTipVisible?: boolean;
  setIsDoneToolTipVisible?: React.Dispatch<SetStateAction<boolean>>;
}

export const WatchlistAddSuccess = (
  props: WatchlistAddSuccessProps
): JSX.Element => {
  const {
    address,
    onDone,
    handleSuccessModalClose = () => null,
    setIsEditToolTipVisible = () => null,
    isEditToolTipVisible = false,
    isDoneToolTipVisible = false,
    setIsDoneToolTipVisible = () => null
  } = props;

  const allAddresses = useAllAddresses();
  const wallet = allAddresses.find((w) => w.address === address);
  const editModal = useForwardedRef<BottomSheetRef>(null);

  const { status, handleStepChange, handleSkipTutorial } = useOnboardingStatus(
    (v) => v
  );
  const {
    title,
    subtitle,
    buttonRightTitle,
    buttonLeftTitle,
    isButtonLeftVisible
  } = useOnboardingToolTip(status);

  const navigation = useNavigation<WalletsNavigationProp>();

  if (!wallet)
    return (
      <View>
        <Text>Unknown Error</Text>
      </View>
    );

  const showEdit = () => {
    if (status !== 'none') handleStepChange('step-5');
    editModal.current?.show();
    setIsEditToolTipVisible(false);
  };

  const handleOnboardingSuccessStepChange = (type: 'back' | 'next') => {
    handleStepChange(type === 'back' ? 'step-4' : 'step-5');
    setIsEditToolTipVisible(false);
    if (type === 'back') {
      setTimeout(() => {
        handleSuccessModalClose();
      }, 0);
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
          isVisible={isEditToolTipVisible}
          content={
            <OnBoardingToolTipBody
              title={title}
              buttonRightTitle={buttonRightTitle}
              subtitle={subtitle}
              buttonLeftTitle={buttonLeftTitle}
              handleButtonLeftPress={() =>
                handleOnboardingSuccessStepChange('back')
              }
              handleButtonRightPress={handleSkipTutorial}
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
        <Tooltip
          tooltipStyle={{ flex: 1, left: 30 }}
          contentStyle={{ height: 80, borderRadius: 8 }}
          arrowSize={{ width: 16, height: 8 }}
          childrenWrapperStyle={{
            backgroundColor: 'transparent',
            borderRadius: 25,
            borderWidth: 1,
            borderColor: 'white',
            paddingHorizontal: 18
          }}
          backgroundColor="rgba(0,0,0,0.5)"
          isVisible={isDoneToolTipVisible}
          content={
            <OnBoardingToolTipBody
              buttonRightTitle={''}
              title={title}
              subtitle={subtitle}
              buttonLeftTitle={''}
            />
          }
          placement="top"
          onClose={() => null}
        >
          <Button
            onPress={() => {
              if (onDone && status !== 'step-11') return onDone();
              if (status === 'step-11' && onDone) {
                setIsDoneToolTipVisible(false);

                handleStepChange('step-12');
                navigation.navigate('Wallets');

                setTimeout(() => {
                  onDone();
                }, 1000);
              }
            }}
            type="circular"
            style={{ ...styles.button, backgroundColor: '#0e0e0e0d' }}
          >
            <Text title fontFamily="Inter_600SemiBold">
              Done
            </Text>
          </Button>
        </Tooltip>
      </View>
      <BottomSheetEditWallet
        ref={editModal}
        wallet={wallet}
        setIsDoneToolTipVisible={setIsDoneToolTipVisible}
      />
    </View>
  );
};
