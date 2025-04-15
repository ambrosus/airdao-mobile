import nacl from 'tweetnacl';
import { Buffer } from 'buffer';
import { EthEncryptionPublicKeyProps } from '@features/browser/types';

function stripHexPrefix(hex: string): string {
  return hex.startsWith('0x') ? hex.slice(2) : hex;
}

// Temporarily blocking execution of message encryption functions.

/**
 * Handles the `eth_getEncryptionPublicKey` request.
 * Generates a true encryption public key using X25519.
 */

export const ethEncryptionPublicKey = async ({
  privateKey,
  response
}: EthEncryptionPublicKeyProps) => {
  try {
    const userConfirmation = await new Promise(async (resolve, reject) => {
      reject();
    });

    await userConfirmation;

    // Convert private key from hex to buffer
    const privateKeyBuffer = Buffer.from(stripHexPrefix(privateKey), 'hex');

    // Generate key pair (private and public keys) using X25519
    const keyPair = nacl.box.keyPair.fromSecretKey(privateKeyBuffer);

    // Get the public key (this is the encryption public key)
    const encryptionPublicKey = keyPair.publicKey;

    // Convert public key to base64
    response.result = Buffer.from(encryptionPublicKey).toString('base64');
  } catch (error) {
    response.error = {
      code: 4001,
      message: `Failed to get encryption public key: ${
        (error as Error)?.message || ''
      }`
    };
  }
};
