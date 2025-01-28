import { View } from 'react-native';
import { Spinner, SpinnerProps } from '@components/base';

export const CenteredSpinner = (props: SpinnerProps) => {
  const containerStyle = props.containerStyle || {};
  return (
    <View style={{ alignSelf: 'center', ...containerStyle }}>
      <Spinner {...props} />
    </View>
  );
};
