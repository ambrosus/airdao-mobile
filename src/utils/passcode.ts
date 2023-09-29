import { database } from '@database/main';

const getPasscodeFromDB = async () => {
  try {
    const passcodeRes = await database.localStorage.get('Passcode');
<<<<<<< Updated upstream
    return (passcodeRes as string[]) || [];
=======
    return passcodeRes;
>>>>>>> Stashed changes
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

export const PasscodeUtils = {
  getPasscodeFromDB,
  setPasscodeInDB,
  getFaceIDStatusFromDB,
  setFaceIDStatusInDB
};
