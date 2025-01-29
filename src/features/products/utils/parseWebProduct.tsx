import React from 'react';
import { Image } from 'react-native';
import { BrowserItemModel } from '@entities/browser/model';

export const parseWebProduct = (
  product: BrowserItemModel,
  currentLanguage: string
) => {
  const icon = (
    <Image
      style={{
        width: 47,
        height: 47,
        resizeMode: 'contain'
      }}
      source={{ uri: product.icon }}
    />
  );

  return {
    ...product,
    icon,
    name: product.name[currentLanguage],
    route: 'BrowserScreen',
    description: product.description[currentLanguage],
    // TODO firebaseEVENT
    firebaseEvent: ''
  };
};
