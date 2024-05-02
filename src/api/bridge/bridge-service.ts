import axios from 'axios';
import { getBridge } from './sdk/BridgeSDK';
import { Config } from '@api/bridge/sdk/types';

interface BridgeParamsModel {
  data: Config;
}

const ProdApi =
  'https://raw.githubusercontent.com/ambrosus/ambrosus-bridge/28ef2bb7d101581436e2fd2deba740d5698795a8/contracts/configs/main.json';
const TestNetApi =
  'https://raw.githubusercontent.com/ambrosus/ambrosus-bridge/dev/contracts/configs/test.json \n';
const getBridgeParams = async (): Promise<BridgeParamsModel> => {
  const testNet = false;
  const apiUrl = testNet ? TestNetApi : ProdApi;
  try {
    return await axios.get(apiUrl);
  } catch (error) {
    throw error;
  }
};

export const bridgeService = {
  getBridgeParams,
  getBridge
};
