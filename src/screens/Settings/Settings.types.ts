import { ReactNode } from 'react';
import { SettingsTabParamsList } from '@appTypes/navigation/settings';

export interface SettingsMenuItem {
  key: string;
  title: string;
  route: keyof SettingsTabParamsList;
  icon: ReactNode;
}
