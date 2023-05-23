import React from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { Button, Row, Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { BrowserIcon, GitHubIcon } from '@components/svg/icons';
import { scale, verticalScale } from '@utils/scaling';

const LinkButton = ({
  title,
  url,
  icon
}: {
  title: string;
  url: string;
  icon: React.ReactNode;
}) => {
  const openLink = () => {
    Linking.openURL(url);
  };

  return (
    <Button onPress={openLink} style={styles.linkBtn} type="circular">
      <Row alignItems="center">
        {icon}
        <Spacer value={verticalScale(6)} horizontal />
        <Text
          fontSize={12}
          fontFamily="Inter_500Medium"
          color={COLORS.raisinBlack}
        >
          {title}
        </Text>
      </Row>
    </Button>
  );
};

export function AMBAbout(): JSX.Element {
  return (
    <View>
      <Text fontSize={12} fontFamily="Inter_500Medium" color={COLORS.slateGrey}>
        AirDAO is a decentralized autonomous organization governing the Ambrosus
        blockchain and its network of dApps. As the first DAO to encompass an
        entire L1 blockchain ecosystem, AirDAO is building an integrated suite
        of digital products and services that strip away the needless complexity
        from Web3 and bring its benefits to the average consumer via a single,
        easy-to-use web interface.
      </Text>
      <Spacer value={verticalScale(16)} />
      <Row alignItems="center">
        <LinkButton
          title="Website"
          url="https://airdao.io/"
          icon={<BrowserIcon />}
        />
        <Spacer value={verticalScale(16)} horizontal />
        <LinkButton
          title="Github"
          url="https://github.com/ambrosus/"
          icon={<GitHubIcon />}
        />
      </Row>
    </View>
  );
}

const styles = StyleSheet.create({
  linkBtn: {
    backgroundColor: COLORS.smokyBlack5,
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(4)
  }
});
