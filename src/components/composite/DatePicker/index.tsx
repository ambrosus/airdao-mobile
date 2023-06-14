import React, { useCallback } from 'react';
import CalendarPicker from 'react-native-calendar-picker';
import { DatePickerProps } from './DatePicker.types';
import { Row, Spacer } from '@components/base';
import { ChevronLeftIcon, ChevronRightIcon } from '@components/svg/icons';
import { scale } from '@utils/scaling';

export const DatePicker = (props: DatePickerProps): JSX.Element => {
  const { selectedStartDate, selectedEndDate, period } = props;
  const renderNextComponent = useCallback(
    () => (
      <Row>
        <ChevronLeftIcon color="#000000" scale={1.2} />
        <Spacer value={scale(32)} horizontal />
        <ChevronRightIcon color="#000000" scale={1.2} />
      </Row>
    ),
    []
  );

  return (
    <CalendarPicker
      nextComponent={renderNextComponent()}
      selectedStartDate={selectedStartDate}
      selectedEndDate={period ? selectedEndDate : selectedStartDate}
    />
  );
};
