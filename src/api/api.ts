import { ExplorerAccountType } from '@appTypes/enums';
import { AMBTokenDTO, ExplorerAccountDTO, ExplorerInfoDTO } from '@models/dtos';
import axios from 'axios';

const getExplorerAccountTypeFromResponseMeta = (
  search: string
): ExplorerAccountType => {
  if (search.includes('apollo')) return ExplorerAccountType.Apollo;
  else if (search.includes('atlas')) return ExplorerAccountType.Atlas;
  return ExplorerAccountType.Account;
};

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

export const getExplorerAccounts = async (): Promise<ExplorerAccountDTO[]> => {
  try {
    const response = await axios.get(
      'https://explorer-api.ambrosus.io/accounts/'
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const searchAddress = async (
  address: string
): Promise<ExplorerAccountDTO> => {
  try {
    const response = await axios.get(
      `https://explorer-api.ambrosus.io/search/${address}`
    );
    const { meta, data } = response.data;
    const type = getExplorerAccountTypeFromResponseMeta(meta.search);
    return data.account ? { ...data.account, type } : { ...data, type };
  } catch (error) {
    throw error;
  }
};
