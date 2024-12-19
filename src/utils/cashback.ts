import AirDAOKeysForRef from '@lib/crypto/AirDAOKeysForRef';
import AirDAOKeysForRefStorage from '@lib/crypto/AirDAOKeysForRefStorage';
import singleAirDAOStorage from '@lib/crypto/AirDAOKeysStorage';

const getByHash = async (tmpHash: string) => {
  let tmpPublicAndPrivateResult =
    await AirDAOKeysForRefStorage.getPublicAndPrivateResultForHash(tmpHash);
  let result;
  if (
    tmpPublicAndPrivateResult &&
    typeof tmpPublicAndPrivateResult.cashbackToken !== 'undefined'
  ) {
    return tmpPublicAndPrivateResult;
  }
  const mnemonic = await singleAirDAOStorage.getWalletMnemonic(tmpHash);

  if (!mnemonic) {
    return false;
  }
  try {
    tmpPublicAndPrivateResult = await AirDAOKeysForRef.discoverPublicAndPrivate(
      {
        mnemonic
      }
    );
    result = JSON.parse(JSON.stringify(tmpPublicAndPrivateResult));
  } catch (error) {
    // ignore
  }
  try {
    await AirDAOKeysForRefStorage.setPublicAndPrivateResultForHash(
      tmpHash,
      tmpPublicAndPrivateResult
    );
  } catch (e: any) {}
  const { cashbackToken } = tmpPublicAndPrivateResult;
  return {
    cashbackToken,
    tmpPublicAndPrivateResult: result
  };
};

export const CashBackUtils = { getByHash };
