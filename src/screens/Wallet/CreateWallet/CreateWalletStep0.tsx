import React, { useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CheckBox, Header } from '@components/composite';
import { Button, Row, Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils/scaling';
import { ElipseIcon } from '@components/svg/icons/Elipse';

const Title = ({ children }: { children: React.ReactNode }) => (
  <Text
    title
    fontFamily="Inter_600SemiBold"
    fontSize={16}
    color={COLORS.smokyBlack}
  >
    {children}
  </Text>
);

export const CreateWalletStep0 = () => {
  const { top } = useSafeAreaInsets();
  const [selected, setSelected] = useState<boolean>(false);
  return (
    <View style={{ flex: 1, top }}>
      <Header
        titlePosition="left"
        title={
          <Text
            fontFamily="Inter_600SemiBold"
            fontSize={16}
            color={COLORS.nero}
          >
            Create new wallet
          </Text>
        }
        style={{ shadowColor: 'transparent' }}
      />
      <View style={{ paddingHorizontal: scale(18), alignSelf: 'center' }}>
        <Text
          align="center"
          fontSize={24}
          fontFamily="Inter_700Bold"
          color={COLORS.nero}
        >
          Backup your wallet
        </Text>
        <Spacer value={verticalScale(8)} />
        <Row alignItems="center">
          <Text
            align="center"
            fontSize={15}
            fontFamily="Inter_500Medium"
            color={COLORS.nero}
          >
            Your wallet will be backed up with a{' '}
          </Text>
          <Button>
            <Text
              align="center"
              fontSize={15}
              fontFamily="Inter_500Medium"
              color={COLORS.blue600}
            >
              recovery phrase
            </Text>
          </Button>
        </Row>
        <Spacer value={verticalScale(8)} />
        <Text
          align="center"
          fontSize={15}
          fontFamily="Inter_500Medium"
          color={COLORS.nero}
        >
          Make sure you have a pen and paper ready so you can write it down.
        </Text>
        <Spacer value={verticalScale(64)} />
        <View style={{ alignSelf: 'center' }}>
          <ElipseIcon />
        </View>
        <Spacer value={verticalScale(133)} />
        <Row>
          <CheckBox
            fillColor={COLORS.blue500}
            color={COLORS.white}
            type="square"
            value={selected}
          />
          <Spacer horizontal value={scale(12)} />
          <Text fontSize={15} fontFamily="Inter_500Medium" color={COLORS.nero}>
            I understand that if I lose my recovery phrase, AirDAO cannot
            restore it.
          </Text>
        </Row>
        <Spacer value={verticalScale(32)} />
        <Button type="circular" style={{ backgroundColor: COLORS.gray200 }}>
          <Text
            fontSize={16}
            fontFamily="Inter_600SemiBold"
            color={COLORS.asphalt}
            style={{ marginVertical: scale(12) }}
          >
            Continue
          </Text>
        </Button>
      </View>
    </View>
  );
};
