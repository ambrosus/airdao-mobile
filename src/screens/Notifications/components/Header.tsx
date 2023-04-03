import React from 'react';
import { Button, Row, Spacer } from '@components/base';
import { Header } from '@components/composite';
import { FilterIcon, SettingsIcon } from '@components/svg/icons';

export const NotificationsHeader = (): JSX.Element => {
  const renderContentRight = () => {
    return (
      <Row alignItems="center">
        <Button>
          <FilterIcon />
        </Button>
        <Spacer value={38} horizontal />
        <Button>
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
