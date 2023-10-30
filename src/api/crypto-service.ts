import singleAirDAODispatcher from '@crypto/blockchains/AirDAODispatcher';
import { AirDAODictTypes } from '@crypto/common/AirDAODictTypes';
import AirDAOUtils from '@crypto/common/AirDAOUtils';

const getBalanceOfAddress = async (
  address: string,
  currencyCode = AirDAODictTypes.Code.AMB
) => {
  try {
    const processor = singleAirDAODispatcher.getScannerProcessor(currencyCode);
    const weiBalance = await processor.getBalance(address);
    return { wei: weiBalance, ether: AirDAOUtils.toEther(weiBalance) };
  } catch (error) {
    throw error;
  }
};

export const cryptoService = {
  getBalanceOfAddress
};
