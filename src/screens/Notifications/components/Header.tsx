import React from 'react';
import { Button, Row, Spacer } from '@components/base';
import { Header } from '@components/composite';
import { FilterButtonIcon } from '@components/svg/FilterButton';
import { SettingsButtonIcon } from '@components/svg/SettingsButtonIcon';

export const NotificationsHeader = (): JSX.Element => {
  const renderContentRight = () => {
    return (
      <Row alignItems="center">
        <Button>
          <FilterButtonIcon />
        </Button>
        <Spacer value={38} horizontal />
        <Button>
          <SettingsButtonIcon />
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
