import { database } from '@database/main';

const getPasscodeFromDB = async () => {
  try {
    const passcodeRes = await database.localStorage.get('Passcode');
    return passcodeRes;
  } catch (error) {
    console.error('Error fetching Passcode from the database:', error);
    return [];
  }
};

const setPasscodeInDB = async (passcode: string[]) => {
  try {
    await database.localStorage.set('Passcode', passcode);
  } catch (error) {
    console.error('Error setting Passcode in the database:', error);
  }
};

const getFaceIDStatusFromDB = async () => {
  try {
    const faceIDRes = await database.localStorage.get('FaceID');
    return !!faceIDRes;
  } catch (error) {
    console.error('Error fetching FaceID status from the database:', error);
    return false;
  }
};

const setFaceIDStatusInDB = async (isEnabled: boolean) => {
  try {
    await database.localStorage.set('FaceID', isEnabled);
  } catch (error) {
    console.error('Error setting FaceID status in the database:', error);
  }
};

const verifyPasscode = async (enteredPasscode: string[]) => {
  const passcode = await PasscodeUtils.getPasscodeFromDB();
  return JSON.stringify(passcode) === JSON.stringify(enteredPasscode);
};

export const PasscodeUtils = {
  getPasscodeFromDB,
  setPasscodeInDB,
  getFaceIDStatusFromDB,
  setFaceIDStatusInDB,
  verifyPasscode
};
