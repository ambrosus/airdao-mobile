import axios from 'axios';
import Config from '@constants/config';
import { BrowserConfig } from '@entities/browser/model/types';

const getBrowserConfig = async (): Promise<BrowserConfig> => {
  const apiUri = Config.BROWSER_CONFIG;
  try {
    const res = await axios.get(apiUri);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const browserService = {
  getBrowserConfig
};
