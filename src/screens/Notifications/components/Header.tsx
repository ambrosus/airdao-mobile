import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Row, Spacer } from '@components/base';
import { Header } from '@components/composite';
import { SettingsFilledIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { moderateScale } from '@utils/scaling';

interface NotificationsHeaderProps {
  onSettingsPress: () => unknown;
}

export const NotificationsHeader = (
  props: NotificationsHeaderProps
): JSX.Element => {
  const { onSettingsPress = () => null } = props;

  const renderContentRight = () => {
    return (
      <Row alignItems="center">
        <Spacer value={38} horizontal />
        <Button
          type="circular"
          onPress={onSettingsPress}
          testID="settings-button"
          style={{
            backgroundColor: COLORS.smokyBlack5,
            padding: moderateScale(12)
          }}
        >
          <SettingsFilledIcon color={COLORS.smokyBlack} scale={1.8} />
        </Button>
      </Row>
    );
  };
  return (
    <Header
      titleStyle={styles.headerTitle}
      title="Notifications"
      titlePosition="left"
      contentRight={renderContentRight()}
    />
  );
};

const styles = StyleSheet.create({
  headerTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    color: COLORS.smokyBlack
  }
});
