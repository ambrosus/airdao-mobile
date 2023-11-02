import { Cache, CacheKey } from '@lib/cache';

const getPasscodeFromDB = async () => {
  try {
    const passcodeRes = await Cache.getItem(CacheKey.Passcode);
    return passcodeRes;
  } catch (error) {
    console.error('Error fetching Passcode from the database:', error);
    return [];
  }
};

const setPasscodeInDB = async (passcode: string[]) => {
  try {
    await Cache.setItem(CacheKey.Passcode, passcode.join(''));
  } catch (error) {
    console.error('Error setting Passcode in the database:', error);
  }
};

const getFaceIDStatusFromDB = async () => {
  try {
    const faceIDRes = await Cache.getItem(CacheKey.IsBiometricEnabled);
    return faceIDRes === 'true';
  } catch (error) {
    console.error('Error fetching FaceID status from the database:', error);
    return false;
  }
};

const setFaceIDStatusInDB = async (isEnabled: boolean) => {
  try {
    await Cache.setItem(CacheKey.IsBiometricEnabled, isEnabled);
  } catch (error) {
    console.error('Error setting FaceID status in the database:', error);
  }
};

const verifyPasscode = async (enteredPasscode: string[]) => {
  const passcode = await getPasscodeFromDB();
  return passcode == enteredPasscode.join('');
};

export const PasscodeUtils = {
  getPasscodeFromDB,
  setPasscodeInDB,
  getFaceIDStatusFromDB,
  setFaceIDStatusInDB,
  verifyPasscode
};
