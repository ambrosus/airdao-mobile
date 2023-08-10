import AirDAOKeysStorage from '@lib/helpers/AirDAOKeysStorage';
import AirDAOKeysForRefStorage from '@lib/helpers/AirDAOKeysForRefStorage';
import AirDAOKeysForRef from '@lib/helpers/AirDAOKeysForRef';

const getByHash = async (tmpHash: string) => {
  let tmpPublicAndPrivateResult =
    await AirDAOKeysForRefStorage.getPublicAndPrivateResultForHash(tmpHash);
  if (
    tmpPublicAndPrivateResult &&
    typeof tmpPublicAndPrivateResult.cashbackToken !== 'undefined'
  ) {
    // Log.log('SRV/CashBack getByHash ' + tmpHash + ' => ' + tmpPublicAndPrivateResult.cashbackToken)
    return tmpPublicAndPrivateResult;
  }
  // await Log.log('SRV/CashBack getByHash need to discoverPublic', tmpHash)
  const mnemonic = await AirDAOKeysStorage.getWalletMnemonic(tmpHash);
  console.log({ mnemonic });

  if (!mnemonic) {
    return false;
  }
  // await Log.log('SRV/CashBack getByHash got mnemonic to discoverPublic')
  try {
    tmpPublicAndPrivateResult = await AirDAOKeysForRef.discoverPublicAndPrivate(
      {
        mnemonic
      }
    );
    console.log({ tmpPublicAndPrivateResult });
  } catch (error) {
    console.log({ error });
  }
  // // await Log.log('SRV/CashBack getByHash done discoverPublic ' + tmpHash + ' => ' + tmpPublicAndPrivateResult.cashbackToken)
  // try {
  //   await AirDAOKeysForRefStorage.setPublicAndPrivateResultForHash(
  //     tmpHash,
  //     tmpPublicAndPrivateResult
  //   );
  // } catch (e) {}
  return tmpPublicAndPrivateResult;
};

export const CashBackUtils = { getByHash };
