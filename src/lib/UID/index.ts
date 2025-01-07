import { keccak256, toUtf8Bytes } from 'ethers/lib/utils';
import { getModel, getUniqueId } from 'react-native-device-info';

const UID = async () => {
  const getUID = async () =>
    `${await getUniqueId()}${getModel().replace(/\s/g, '')}`;
  return keccak256(toUtf8Bytes(await getUID()));
};

export default UID;
