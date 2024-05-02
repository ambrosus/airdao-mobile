import axios from 'axios';
import { AMBTokenDTO, StakingPoolDTO } from '@models/dtos';
import { PriceSnapshot } from '@appTypes';
import { AMBToken } from '@models';
import { watcherService } from './watcher-service';
import { explorerService } from './explorer-service';
import { cryptoService } from './crypto-service';
import Config from '@constants/config';
import { bridgeService } from '@api/bridge/bridge-service';

const getAMBTokenData = async (): Promise<AMBTokenDTO> => {
  try {
    const response = await axios.get('https://token.ambrosus.io/');
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

const getAMBPriceHistoricalPricing = async (): Promise<AMBToken[]> => {
  try {
    const res = await axios.get(
      `${Config.WALLET_API_URL}/api/v1/watcher-historical-prices`
    );
    const chartData: PriceSnapshot[] = res.data.prices;
    const mappedData = chartData.map((data) => AMBToken.fromCMCResponse(data));
    return mappedData;
  } catch (error) {
    throw error;
  }
};

const getAmbrosusStakingPools = async (): Promise<StakingPoolDTO[]> => {
  try {
    const res = await axios.get(`${Config.STAKING_API_URL}`);
    const poolsMap: { [key: string]: StakingPoolDTO } = res.data.data;
    const poolsArray = Object.keys(poolsMap).map((key) => poolsMap[key]);
    return poolsArray;
  } catch (error) {
    throw error;
  }
};

export const API = {
  getAMBTokenData,
  getAMBPriceHistoricalPricing,
  getAmbrosusStakingPools,
  bridgeService,
  explorerService,
  watcherService,
  cryptoService
};
