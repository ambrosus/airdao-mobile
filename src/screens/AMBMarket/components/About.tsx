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
import { useTranslation } from 'react-i18next';

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
    url: 'https://discord.com/invite/airdao',
    icon: <DiscordIcon />
  },
  {
    title: 'Telegram',
    url: 'https://t.me/airdao',
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
          color={COLORS.neutral700}
        >
          {title}
        </Text>
      </Row>
    </Button>
  );
};

export function AMBAbout(): JSX.Element {
  const { t } = useTranslation();
  return (
    <View>
      <Text
        fontSize={14}
        fontFamily="Inter_500Medium"
        color={COLORS.neutral400}
      >
        {t('amb.market.statistics.text')}
      </Text>
      <Spacer value={verticalScale(16)} />
      <Row alignItems="center" style={styles.socialButtons}>
        {SOCIAL_LINKS.map((link) => (
          <LinkButton key={link.url} {...link} />
        ))}
      </Row>
    </View>
  );
}

const styles = StyleSheet.create({
  linkBtn: {
    backgroundColor: COLORS.alphaBlack5,
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(4),
    gap: 10
  },
  socialButtons: {
    flex: 1,
    flexWrap: 'wrap',
    rowGap: scale(16),
    columnGap: verticalScale(16)
  }
});
