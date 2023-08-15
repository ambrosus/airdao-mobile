/**
 * @author Ksu
 * @version 0.11
 */
import AirDAOCryptoLog from '../../common/AirDAOCryptoLog';
import AirDAODispatcher from '../../blockchains/AirDAODispatcher';

class BlocksoftSecrets {
  /**
   * @type {{}}
   * @private
   */
  _processor = {};

  /**
   * @param {string} params.currencyCode
   * @param {string} params.mnemonic
   * @return {Promise<{hash}>}
   */
  async getWords(params) {
    const currencyCode = params.currencyCode;
    if (!currencyCode) {
      throw new Error('plz set currencyCode before calling');
    }

    if (!this._processor[currencyCode]) {
      /**
       * @type {XmrSecretsProcessor}
       */
      this._processor[currencyCode] =
        AirDAODispatcher.getSecretsProcessor(currencyCode);
    }

    let res = '';
    try {
      AirDAOCryptoLog.log(`BlocksoftSecrets.getWords ${currencyCode} started`);
      res = await this._processor[currencyCode].getWords(params);
      AirDAOCryptoLog.log(`BlocksoftSecrets.getWords ${currencyCode} finished`);
    } catch (e) {
      // noinspection ES6MissingAwait
      AirDAOCryptoLog.err(
        `BlocksoftSecrets.getWords ${currencyCode} error ` + e.message,
        e.data ? e.data : e
      );
      throw e;
    }

    return res;
  }
}

const singleBlocksoftSecrets = new BlocksoftSecrets();

export default singleBlocksoftSecrets;