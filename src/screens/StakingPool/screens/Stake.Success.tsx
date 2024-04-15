import React, { useMemo } from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import { Spacer, Text } from '@components/base';
import { PrimaryButton } from '@components/modular';
import { COLORS } from '@constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute
} from '@react-navigation/native';
import { HomeParamsList } from '@appTypes';
import { SuccessIcon } from '@components/svg/icons';
import { verticalScale } from '@utils/scaling';

export const StakeSuccessScreen = () => {
  const route = useRoute<RouteProp<HomeParamsList, 'StakeSuccessScreen'>>();
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NavigationProp<HomeParamsList, 'StakeSuccessScreen'>>();

  const onDoneTransactionPress = () => navigation.goBack();

  const resolveDetailsTypography = useMemo(() => {
    return route.params.type === 'stake'
      ? "You've staked AMB! You're now earning rewards with every passing moment."
      : "You've withdrawn your AMB. Your funds are now liquid and ready for action.";
  }, [route.params.type]);

  return (
    <View style={styles.container}>
      <SuccessIcon />
      <Spacer value={verticalScale(16)} />
      <Text color={COLORS.neutral800} fontFamily="Inter_700Bold" fontSize={20}>
        Success
      </Text>
      <Spacer value={verticalScale(8)} />
      <Text
        align="center"
        color={COLORS.neutral600}
        style={styles.description}
        fontSize={16}
        fontFamily="Inter_500Medium"
      >
        {resolveDetailsTypography}
      </Text>
      <View style={{ ...styles.footer, bottom: insets.bottom }}>
        <PrimaryButton onPress={onDoneTransactionPress}>
          <Text
            fontFamily="Inter_600SemiBold"
            fontSize={16}
            color={COLORS.neutral0}
          >
            Done
          </Text>
        </PrimaryButton>
      </View>
    </View>
  );
};
