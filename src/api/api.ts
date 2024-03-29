import axios from 'axios';
import { AMBTokenDTO, StakingPoolDTO } from '@models/dtos';
import { CMCChartData, CMCInterval } from '@appTypes';
import { AMBToken } from '@models';
import { watcherService } from './watcher-service';
// import Config from '@constants/config';
import { explorerService } from './explorer-service';
import { cryptoService } from './crypto-service';
import Config from '@constants/config';

// const cmcApiUrl = Config.CMC_API_URL;

const getAMBTokenData = async (): Promise<AMBTokenDTO> => {
  try {
    const response = await axios.get('https://token.ambrosus.io/');
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

const getAMBPriceHistoricalPricing = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interval: CMCInterval
): Promise<AMBToken[]> => {
  try {
    const res = await axios.get(
      `${Config.WALLET_API_URL}/api/v1/watcher-historical-prices`
      // {
      //   headers: {
      //     'X-CMC_PRO_API_KEY': 'b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c'
      //   }
      // }
    );
    // const chartData: CMCChartData = res.data?.data;
    const chartData: CMCChartData = res.data.prices;
    // const mappedData = chartData['2081'].quotes.map((quote) =>
    //   AMBToken.fromCMCResponse(quote)
    // );
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
  explorerService,
  watcherService,
  cryptoService
};
