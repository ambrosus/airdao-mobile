import React from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { Button, Row, Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import {
  BrowserIcon,
  DiscordIcon,
  GitHubIcon,
  TelegramIcon,
  TwitterIcon
} from '@components/svg/icons';
import { scale, verticalScale } from '@utils/scaling';

interface Link {
  title: string;
  url: string;
  icon: React.ReactNode;
}

const SOCIAL_LINKS: Link[] = [
  {
    title: 'Website',
    url: 'https://airdao.io/',
    icon: <BrowserIcon />
  },
  {
    title: 'Github',
    url: 'https://github.com/ambrosus/',
    icon: <GitHubIcon />
  },
  {
    title: 'Twitter',
    url: 'https://twitter.com/airdao_io/',
    icon: <TwitterIcon />
  },
  {
    title: 'Discord',
    url: 'https://discord.gg/hnftmSjUr8',
    icon: <DiscordIcon />
  },
  {
    title: 'Telegram',
    url: 'https://t.me/airDAO_official',
    icon: <TelegramIcon />
  }
];

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
        AirDAO is a community-governed layer one blockchain and ecosystem of
        web3 dApps, powered by its native token, AMB. AirDAO brings the benefits
        of Web3 to a global audience with a suite of powerful DeFi products in
        an intuitive, all-in-one interface.
      </Text>
      <Spacer value={verticalScale(16)} />
      <Row
        alignItems="center"
        style={{
          flex: 1,
          flexWrap: 'wrap',
          rowGap: scale(16),
          columnGap: verticalScale(16)
        }}
      >
        {SOCIAL_LINKS.map((link) => (
          <LinkButton key={link.url} {...link} />
        ))}
      </Row>
    </View>
  );
}

const styles = StyleSheet.create({
  linkBtn: {
    backgroundColor: COLORS.smokyBlack5,
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(4),
    gap: 10
  }
});
