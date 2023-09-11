import { SettingsTabParamsList } from '@appTypes';
import { ReactNode } from 'react';

export interface SettingsMenuItem {
  title: string;
  route: keyof SettingsTabParamsList;
  icon: ReactNode;
}
