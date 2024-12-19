import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button, Row, Spacer } from '@components/base';
import { Header } from '@components/composite';
import { SettingsOutlineIcon } from '@components/svg/icons/v2';
import { COLORS } from '@constants/colors';
import { moderateScale } from '@utils';

interface NotificationsHeaderProps {
  onSettingsPress: () => unknown;
}

export const NotificationsHeader = (
  props: NotificationsHeaderProps
): JSX.Element => {
  const { onSettingsPress = () => null } = props;
  const { t } = useTranslation();

  const renderContentRight = useMemo(() => {
    return (
      <Row alignItems="center">
        <Spacer value={38} horizontal />
        <Button onPress={onSettingsPress} testID="settings-button">
          <SettingsOutlineIcon />
        </Button>
      </Row>
    );
  }, [onSettingsPress]);

  return (
    <Header
      titleStyle={styles.headerTitle}
      bottomBorder
      title={t('tab.notifications')}
      contentRight={renderContentRight}
      style={{ shadowColor: COLORS.transparent }}
    />
  );
};

const styles = StyleSheet.create({
  headerTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 17,
    color: COLORS.neutral800
  },
  settingsBtn: {
    backgroundColor: COLORS.alphaBlack5,
    height: moderateScale(40),
    width: moderateScale(40)
  }
});
