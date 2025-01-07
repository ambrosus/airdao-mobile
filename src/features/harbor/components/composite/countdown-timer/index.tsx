import React, { PropsWithChildren, memo, useEffect, useState } from 'react';
import { View } from 'react-native';
import moment from 'moment';
import { Row, Spacer, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { styles } from './styles';

interface CountdownTimerProps {
  timestamp: number;
}

export const CountdownTimer = ({ timestamp }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = moment();
      const target = moment(timestamp);
      const duration = moment.duration(target.diff(now));

      const newTimeLeft = {
        days: Math.max(0, duration.days()),
        hours: Math.max(0, duration.hours()),
        minutes: Math.max(0, duration.minutes()),
        seconds: Math.max(0, duration.seconds())
      };

      // Only update state if the time left has changed
      if (JSON.stringify(newTimeLeft) !== JSON.stringify(timeLeft)) {
        setTimeLeft(newTimeLeft);
      }
    };

    calculateTimeLeft();
    const intervalId = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(intervalId);
  }, [timestamp, timeLeft]);

  const formatValue = (value: number) =>
    value < 10 ? `0${value}` : value.toString();

  return (
    <View style={styles.container}>
      <Text
        fontSize={12}
        fontFamily="Inter_500Medium"
        color={COLORS.softGrayBlue}
      >
        Available through
      </Text>

      <Row alignItems="center">
        <Row alignItems="center">
          <Box>{timeLeft.days}</Box>
          <Spacer horizontal value={8} />
          <Text>days</Text>
        </Row>
        <Row alignItems="center" style={styles.hours}>
          <TimeSegment value={formatValue(timeLeft.hours)} />
          <TimeSegment value={formatValue(timeLeft.minutes)} />
          <TimeSegment
            value={formatValue(timeLeft.seconds)}
            separator={false}
          />
        </Row>
      </Row>
    </View>
  );
};

// Inner Components
const Box = memo(({ children }: PropsWithChildren) => {
  return (
    <View style={styles.box}>
      <Text
        fontSize={14}
        fontFamily="Inter_500Medium"
        color={COLORS.neutral900}
      >
        {children}
      </Text>
    </View>
  );
});

const TimeSegment = memo(
  ({ value, separator = true }: { value: string; separator?: boolean }) => (
    <Row alignItems="center">
      <Box>{value}</Box>
      <Spacer horizontal value={4} />
      {separator && (
        <>
          <Text>:</Text>
          <Spacer horizontal value={4} />
        </>
      )}
    </Row>
  ),
  (prevProps, nextProps) => prevProps.value === nextProps.value
);
