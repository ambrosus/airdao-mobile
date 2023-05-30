import React from 'react';
import { Button, Row, Spacer } from '@components/base';
import { Header } from '@components/composite';
import { SettingsIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { StyleSheet } from 'react-native';

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
        <Button onPress={onSettingsPress} testID="settings-button">
          <SettingsIcon />
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
