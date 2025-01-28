import { useNavigation } from '@react-navigation/native';
import { HomeNavigationProp } from '@appTypes';
import { KosmosAccountActionIcon } from '@components/svg/icons/v2/actions';
import {
  CustomAppEvents,
  sendFirebaseEvent
} from '@lib/firebaseEventAnalytics';
import { AccountActionButton } from './ActionButton';

interface KosmosProps {
  readonly disabled: () => boolean;
}

export const Kosmos = ({ disabled }: KosmosProps) => {
  const navigation: HomeNavigationProp = useNavigation();

  const onNavigateToKosmos = () => {
    sendFirebaseEvent(CustomAppEvents.main_kosmos);
    navigation.navigate('KosmosScreen');
  };

  return (
    <AccountActionButton
      Icon={({ color }) => <KosmosAccountActionIcon color={color} />}
      onPress={onNavigateToKosmos}
      text="Kosmos"
      isActive={disabled()}
    />
  );
};
