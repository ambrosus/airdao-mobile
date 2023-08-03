import createHash from 'create-hash';

class AirDAOCryptoUtils {
  static sha256(stringHex: string) {
    return createHash('sha256').update(stringHex, 'hex').digest('hex');
  }
}

export default AirDAOCryptoUtils;
