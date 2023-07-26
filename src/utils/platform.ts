import * as StoreReview from 'expo-store-review';

const requestReview = async () => {
  const isAvailable = await StoreReview.isAvailableAsync();
  if (isAvailable) {
    await StoreReview.requestReview();
  }
};

export const PlatformSpecificUtils = { requestReview };
