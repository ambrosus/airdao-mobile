import React from 'react';
import '@testing-library/jest-native/extend-expect';
import { screen, render } from '@testing-library/react-native';
import { NotificationBox } from '../notification-box';
import type { Notification } from '@models';
import { NotificationType } from '@appTypes';
import { COLORS } from '@constants/colors';

type OmitNotification = Omit<Notification, '_id' | 'createdAt'>;

const TEXT_ID = 'notification_percentage_text';

const PositivePriceChangeNotification: OmitNotification = {
  body: '🚀 AMB Price changed on +0.01%! Current price $0.00873',
  title: 'Price Alert',
  type: NotificationType.PriceAlert
};

const NegativePriceChangeNotification: OmitNotification = {
  body: '🚀 AMB Price changed on -0.01! Current price $0.00873',
  title: 'Price Alert',
  type: NotificationType.PriceAlert
};

describe('NotificationBox unit test', () => {
  it('renders the component correctly', () => {
    render(
      <NotificationBox
        notification={
          PositivePriceChangeNotification as unknown as Notification
        }
      />
    );

    expect(screen.getByTestId(TEXT_ID)).toBeOnTheScreen();
  });

  it('renders correct negative color style for negative price change', () => {
    render(
      <NotificationBox
        notification={
          NegativePriceChangeNotification as unknown as Notification
        }
      />
    );

    expect(screen.getByTestId(TEXT_ID)).toHaveStyle({
      color: COLORS.error400
    });
  });
  it('renders correct positive color style for positive price change', () => {
    render(
      <NotificationBox
        notification={
          PositivePriceChangeNotification as unknown as Notification
        }
      />
    );

    expect(screen.getByTestId(TEXT_ID)).toHaveStyle({
      color: COLORS.success400
    });
  });
});
