import React from 'react';
import { render } from '@testing-library/react-native';
import { PortfolioPerformance } from '@components/templates';
import { NumberUtils } from '@utils/number';
import moment from 'moment';

describe('PortfolioPerformance', () => {
  const defaultProps = {
    balance: '1000',
    currency: 'USD',
    currencyPosition: 'left',
    last24HourChange: 10,
    txFee: 0.01,
    title: 'My Portfolio',
    timestamp: new Date()
  };

  it('renders correctly', () => {
    const { getByTestId } = render(<PortfolioPerformance {...defaultProps} />);
    expect(getByTestId('Portfolio_Performance')).toBeTruthy();
  });

  it('displays the correct title', () => {
    const { getByText } = render(<PortfolioPerformance {...defaultProps} />);
    expect(getByText(defaultProps.title)).toBeTruthy();
  });

  it('displays the correct balance', () => {
    const { getByText } = render(<PortfolioPerformance {...defaultProps} />);
    expect(
      getByText(`${defaultProps.currency}${defaultProps.balance}`)
    ).toBeTruthy();
  });

  it('displays the correct txFee', () => {
    const { getByText } = render(<PortfolioPerformance {...defaultProps} />);
    const formattedTxFee = NumberUtils.formatNumber(defaultProps.txFee, 5);
    expect(getByText(formattedTxFee)).toBeTruthy();
  });

  it('displays the correct 24H Change', () => {
    const { getByText } = render(<PortfolioPerformance {...defaultProps} />);
    expect(
      getByText(`${defaultProps.last24HourChange.toFixed(2)}%`)
    ).toBeTruthy();
  });

  it('displays the correct timestamp', () => {
    const { getByText } = render(<PortfolioPerformance {...defaultProps} />);
    const formattedDate = moment(defaultProps.timestamp).format('YYYY-MM-DD');
    const formattedTime = moment(defaultProps.timestamp)
      .format('hh:mm A')
      .toLowerCase();
    expect(getByText(formattedDate)).toBeTruthy();
    expect(getByText(formattedTime)).toBeTruthy();
  });
});
