import MoneroDict from './MoneroDict';
import BlocksoftUtils from '../../../common/AirDAOUtils';

const crc32 = require('buffer-crc32');

type SecretSpendKey = string | Buffer;

interface DictionaryWord {
  word: string;
  prefix: string;
}

interface MoneroDictionary {
  monero_words_english: DictionaryWord[];
  monero_words_english_prefix_len: number;
}

// tslint:disable-next-line:variable-name
const secret_spend_key_to_words = (
  secretSpendKeyBufferOrHex: SecretSpendKey,
  walletHash: string
): string => {
  const buff =
    typeof secretSpendKeyBufferOrHex === 'string'
      ? Buffer.from(secretSpendKeyBufferOrHex, 'hex')
      : secretSpendKeyBufferOrHex;

  const seed: string[] = [];
  let forChecksum = '';

  for (let i = 0; i < 32; i += 4) {
    let w0 = 0;
    for (let j = 3; j >= 0; j--) {
      w0 = w0 * 256 + buff[i + j];
      if (typeof buff[i + j] === 'undefined') {
        throw new Error(
          `XMR word for wallet ${walletHash} needs to be rechecked as buff is too low`
        );
      }
    }

    const moneroDict: MoneroDictionary =
      MoneroDict as unknown as MoneroDictionary;
    const moneroWords: DictionaryWord[] = moneroDict.monero_words_english;

    const w1 = w0 % moneroWords.length;
    const w2 = (Math.floor(w0 / moneroWords.length) + w1) % moneroWords.length;
    const w3 =
      (Math.floor(Math.floor(w0 / moneroWords.length) / moneroWords.length) +
        w2) %
      moneroWords.length;

    seed.push(moneroWords[w1].word);
    seed.push(moneroWords[w2].word);
    seed.push(moneroWords[w3].word);

    forChecksum += moneroWords[w1].prefix.substring(
      0,
      moneroDict.monero_words_english_prefix_len
    );
    forChecksum += moneroWords[w2].prefix.substring(
      0,
      moneroDict.monero_words_english_prefix_len
    );
    forChecksum += moneroWords[w3].prefix.substring(
      0,
      moneroDict.monero_words_english_prefix_len
    );
  }

  const crc32Res = crc32(forChecksum);
  const crc32Decimal = BlocksoftUtils.hexToDecimal(
    '0x' + crc32Res.toString('hex')
  );
  // @ts-ignore
  seed.push(seed[crc32Decimal % 24]);

  return seed.join(' ');
};

export default {
  secret_spend_key_to_words
};
