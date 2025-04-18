import { useCallback } from 'react';
import CalendarPicker from 'react-native-calendar-picker';
import { Row, Spacer } from '@components/base';
import { scale } from '@utils';
import { DatePickerProps } from './DatePicker.types';

export const DatePicker = (props: DatePickerProps): JSX.Element => {
  const { selectedStartDate, selectedEndDate, period } = props;
  const renderNextComponent = useCallback(
    () => (
      <Row>
        {/* <ChevronLeftIcon color={COLORS.black} scale={1.2} /> */}
        <Spacer value={scale(32)} horizontal />
        {/* <ChevronRightIcon color={COLORS.black} scale={1.2} /> */}
      </Row>
    ),
    []
  );

  return (
    // @ts-ignore
    <CalendarPicker
      nextComponent={renderNextComponent()}
      selectedStartDate={selectedStartDate}
      selectedEndDate={period ? selectedEndDate : selectedStartDate}
    />
  );
};
