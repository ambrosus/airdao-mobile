/**
 * @version 0.9
 */
import * as elliptic from 'elliptic';
import createHash from 'create-hash';
import * as EthUtil from 'ethereumjs-util';
import * as bs58 from 'bs58';

const ec: elliptic.ec = new elliptic.ec('secp256k1');

function byte2hexStr(byte: number): string {
  if (typeof byte !== 'number') throw new Error('Input must be a number');
  if (byte < 0 || byte > 255) throw new Error('Input must be a byte');

  // let hexByteMap = '0123456789ABCDEF';
  const hexString = byte.toString(16).toUpperCase();
  return hexString.length === 1 ? '0' + hexString : hexString;
}

interface Signature {
  r: Buffer;
  s: Buffer;
  recoveryParam: number;
}

export default {
  ECKeySign(hashBytes: Buffer, privateBytes: Buffer): string {
    const key: elliptic.ec.KeyPair = ec.keyFromPrivate(privateBytes, 'bytes');
    const signature: Signature = key.sign(hashBytes);
    const r: Buffer = signature.r;
    const s: Buffer = signature.s;
    const id: number = signature.recoveryParam;

    let rHex: string = r.toString('hex');
    while (rHex.length < 64) {
      rHex = `0${rHex}`;
    }

    let sHex: string = s.toString('hex');
    while (sHex.length < 64) {
      sHex = `0${sHex}`;
    }

    const idHex: string = byte2hexStr(id);
    return rHex + sHex + idHex;
  },

  addressToHex(address: string): string {
    if (address.substr(0, 2) === '41') {
      return address;
    }
    const decoded: Buffer = bs58.decode(address.trim());
    return decoded.slice(0, 21).toString('hex');
  },

  privHexToPubHex(privateHex: string): string {
    const key: elliptic.ec.KeyPair = ec.keyFromPrivate(privateHex, 'hex');
    const pubkey: elliptic.ec.KeyPair = key.getPublic();
    const x: Buffer = pubkey.x;
    const y: Buffer = pubkey.y;

    let xHex: string = x.toString('hex');
    while (xHex.length < 64) {
      xHex = `0${xHex}`;
    }

    let yHex: string = y.toString('hex');
    while (yHex.length < 64) {
      yHex = `0${yHex}`;
    }

    return `04${xHex}${yHex}`;
  },

  pubHexToAddressHex(pubHex: string): string {
    if (pubHex.substr(0, 2) === '04') {
      pubHex = '0x' + pubHex.substr(2);
    }
    return '41' + EthUtil.publicToAddress(pubHex).toString('hex');
  },

  addressHexToStr(addressHex: string): string {
    const one: string = createHash('sha256')
      .update(addressHex, 'hex')
      .digest('hex');
    const hash: Buffer = createHash('sha256').update(one, 'hex').digest();
    const checksum: Buffer = hash.slice(0, 4); // checkSum = the first 4 bytes of hash
    const checkSummed: string = addressHex + checksum.toString('hex');
    return bs58.encode(Buffer.from(checkSummed, 'hex'));
  }
};
