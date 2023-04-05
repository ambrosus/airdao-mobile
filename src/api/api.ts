import { AMBTokenDTO, ExplorerInfoDTO } from '@models/dtos';
import axios from 'axios';

export const getAMBTokenData = async (): Promise<AMBTokenDTO> => {
  try {
    const response = await axios.get('https://token.ambrosus.io/');
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getExplorerInfo = async (): Promise<ExplorerInfoDTO> => {
  try {
    const response = await axios.get('https://explorer-api.ambrosus.io/info/');
    return response.data;
  } catch (error) {
    throw error;
  }
};
