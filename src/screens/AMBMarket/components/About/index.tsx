import { Linking, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button, Row, Spacer, Text } from '@components/base';
import {
  BrowserIcon,
  DiscordIcon,
  GitHubIcon,
  RightArrowIcon,
  TelegramIcon,
  TwitterIcon
} from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import Config from '@constants/config';
import { scale, verticalScale } from '@utils';

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
    url: Config.AIRDAO_TELEGRAM_URL,
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
          color={COLORS.brand600}
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
        color={COLORS.neutral800}
        letterSpacing={-0.31}
      >
        {t('amb.market.statistics.text')}
      </Text>
      <Spacer value={verticalScale(16)} />
      <Row alignItems="center" style={styles.socialButtons}>
        <LinkButton
          title={SOCIAL_LINKS[0].title}
          url={SOCIAL_LINKS[0].url}
          icon={
            <View style={styles.websiteArrowRotateIcon}>
              <RightArrowIcon color={COLORS.brand600} />
            </View>
          }
        />
      </Row>
    </View>
  );
}

const styles = StyleSheet.create({
  linkBtn: {
    backgroundColor: COLORS.primary50,
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(8),
    gap: 10
  },
  socialButtons: {
    flex: 1,
    flexWrap: 'wrap',
    rowGap: scale(16),
    columnGap: verticalScale(16)
  },
  websiteArrowRotateIcon: {
    transform: [
      {
        rotate: '-45deg'
      }
    ]
  }
});
