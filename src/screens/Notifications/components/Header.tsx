import React from 'react';
import { Button, Row, Spacer } from '@components/base';
import { Header } from '@components/composite';
import { FilterIcon, SettingsIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { StyleSheet } from 'react-native';

interface NotificationsHeaderProps {
  onFilterPress: () => unknown;
  onSettingsPress: () => unknown;
}

export const NotificationsHeader = (
  props: NotificationsHeaderProps
): JSX.Element => {
  const { onFilterPress = () => null, onSettingsPress = () => null } = props;

  const renderContentRight = () => {
    return (
      <Row alignItems="center">
        <Button onPress={onFilterPress}>
          <FilterIcon />
        </Button>
        <Spacer value={38} horizontal />
        <Button onPress={onSettingsPress}>
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
