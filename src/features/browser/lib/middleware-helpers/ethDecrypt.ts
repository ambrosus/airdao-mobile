import nacl from 'tweetnacl';
import { Buffer } from 'buffer';
import { EthDecryptInputProps } from '@features/browser/types';

const SUPPORTED_ENCRYPTION_VERSION = 'x25519-xsalsa20-poly1305';

const stripHexPrefix = (hex: string): string => {
  return hex.startsWith('0x') ? hex.slice(2) : hex;
};

const hexToBase64 = (hex: string): string => {
  const bytes = Buffer.from(hex, 'hex');
  return bytes.toString('base64');
};
// Temporarily blocking execution of message encryption functions.
export const ethDecrypt = async ({
  params,
  privateKey,
  response
}: EthDecryptInputProps) => {
  const [encryptedData] = params;

  try {
    const userConfirmation = await new Promise(async (resolve, reject) => {
      reject();
      // await requestUserApproval({
      //   browserApproveRef,
      //   selectedAddress: address,
      //   modalType: ModalActionTypes.DECRYPT,
      //   resolve: () => resolve(true),
      //   reject: () => reject(new Error('User rejected the request.'))
      // });
    });

    await userConfirmation;

    // Decode private key from hex string to Uint8Array.
    const privateKeyBytes = new Uint8Array(
      Buffer.from(stripHexPrefix(privateKey), 'hex')
    );

    // Convert encrypted data from hex to base64 if necessary.
    const encryptedDataBase64 = encryptedData.startsWith('0x')
      ? hexToBase64(stripHexPrefix(encryptedData))
      : encryptedData;

    // Decode the encrypted data from base64 to a UTF-8 string.
    const encryptedDataDecoded = Buffer.from(
      encryptedDataBase64,
      'base64'
    ).toString('utf-8');

    // Parse the decoded data as JSON.
    const encryptedJson = JSON.parse(encryptedDataDecoded);
    const { version, nonce, ephemPublicKey, ciphertext } = encryptedJson;

    // Ensure the encryption version is supported.
    if (version !== SUPPORTED_ENCRYPTION_VERSION) {
      throw new Error('Unsupported encryption version');
    }

    // Convert nonce, ephemPublicKey, and ciphertext from base64 to Uint8Array.
    const nonceBytes = new Uint8Array(Buffer.from(nonce, 'base64'));
    const ephemPublicKeyBytes = new Uint8Array(
      Buffer.from(ephemPublicKey, 'base64')
    );
    const ciphertextBytes = new Uint8Array(Buffer.from(ciphertext, 'base64'));

    // Decrypt the message using tweetnacl's box.open function.
    const decrypted = nacl.box.open(
      ciphertextBytes,
      nonceBytes,
      ephemPublicKeyBytes,
      privateKeyBytes
    );

    // If decryption fails, throw an error.
    if (!decrypted) {
      throw new Error('Failed to decrypt message');
    }

    // Store the decrypted result in the response object.
    response.result = Buffer.from(decrypted).toString('utf-8');
  } catch (error) {
    // Log error and set the response error object.
    response.error = {
      code: 4001,
      message: `Failed to get encryption public key: ${
        (error as Error)?.message || ''
      }`
    };
  }
};
