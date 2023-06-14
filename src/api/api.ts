import axios from 'axios';
import { AMBTokenDTO } from '@models/dtos';
import { CMCChartData, CMCInterval } from '@appTypes';
import { AMBToken } from '@models';
import { watcherService } from './watcher-service';
import Config from '@constants/config';
import { explorerService } from './explorer-service';

const cmcApiUrl = Config.CMC_API_URL;

export const getAMBTokenData = async (): Promise<AMBTokenDTO> => {
  try {
    const response = await axios.get('https://token.ambrosus.io/');
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getAMBPriceHistoricalPricing = async (
  interval: CMCInterval
): Promise<AMBToken[]> => {
  try {
    const res = await axios.get(
      `${cmcApiUrl}/v3/cryptocurrency/quotes/historical?id=2081&interval=${interval}`,
      {
        headers: {
          'X-CMC_PRO_API_KEY': 'b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c'
        }
      }
    );
    const chartData: CMCChartData = res.data?.data;
    const mappedData = chartData['2081'].quotes.map((quote) =>
      AMBToken.fromCMCResponse(quote)
    );
    return mappedData;
  } catch (error) {
    throw error;
  }
};

export const API = {
  getAMBTokenData,
  explorerService,
  watcherService
};
