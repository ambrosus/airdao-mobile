import React from 'react';
import { Button, Row, Spacer } from '@components/base';
import { Header } from '@components/composite';
import { FilterIcon, SettingsIcon } from '@components/svg/icons';

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
      title="Notifications"
      titlePosition="left"
      contentRight={renderContentRight()}
    />
  );
};
