import * as Keychain from 'react-native-keychain';
import CryptoJS from 'crypto-js';

const PASSCODE_KEY = 'appPasscode';
const HASH_SECRET = 'your-super-secret-key-for-hashing';

function hashPasscode(passcode: string): string {
  return CryptoJS.SHA256(passcode + HASH_SECRET).toString();
}

export async function savePasscode(passcode: string): Promise<boolean> {
  try {
    const hashedPasscode = hashPasscode(passcode);
    await Keychain.setGenericPassword(PASSCODE_KEY, hashedPasscode, {
      service: 'com.jeroid.app.passcode',
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
    });
    return true;
  } catch (error) {
    console.error('Failed to save passcode', error);
    return false;
  }
}

export async function getPasscodeHash(): Promise<string | null> {
  try {
    const credentials = await Keychain.getGenericPassword({
      service: 'com.jeroid.app.passcode',
    });
    if (credentials) {
      return credentials.password;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Failed to retrieve passcode hash', error);
    return null;
  }
}

export async function deletePasscode(): Promise<boolean> {
  try {
    await Keychain.resetGenericPassword({ service: 'com.jeroid.app.passcode' });
    return true;
  } catch (error) {
    console.error('Failed to delete passcode', error);
    return false;
  }
}

export async function verifyPasscode(inputPasscode: string): Promise<boolean> {
  const storedHash = await getPasscodeHash();
  if (!storedHash) {
    return false;
  }
  const hashedInput = hashPasscode(inputPasscode);
  return hashedInput === storedHash;
}

export async function isPasscodeSet(): Promise<boolean> {
  const hash = await getPasscodeHash();
  return hash !== null;
}
