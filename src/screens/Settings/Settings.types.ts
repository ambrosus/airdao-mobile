import { ReactNode } from 'react';

export interface SettingsMenuItem {
  key: string;
  title: string;
  route: any;
  icon: ReactNode;
}
