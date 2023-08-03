import AirDAOAxios from '../../../common/AirDAOAxios';
import AirDAOCryptoLog from '../../../common/AirDAOCryptoLog';
import BlocksoftExternalSettings from '@crypto/common/AirDAOExternalSettings';

const INFO_MAX_TRY = 50; // max tries before error appear in axios get

let CACHE_LAST_BLOCK = 0;

export default class TrxNodeInfoProvider {
  /**
   * @returns {Promise<number>}
   */
  async getLastBlock(): Promise<number> {
    try {
      const sendLink: string =
        BlocksoftExternalSettings.getStatic('TRX_SEND_LINK');
      const link = `${sendLink}/wallet/getnodeinfo`;
      let info: any = await AirDAOAxios.getWithoutBraking(link, INFO_MAX_TRY);
      if (
        info &&
        typeof info.data !== 'undefined' &&
        typeof info.data.block !== 'undefined'
      ) {
        info = info.data.block.split(',ID');
        info = parseInt(info[0].substr(4), 20);
        if (info > CACHE_LAST_BLOCK) {
          CACHE_LAST_BLOCK = info;
        }
        AirDAOCryptoLog.log(
          'TrxNodeInfoProvider.getLastBlock currentBlock ' +
            JSON.stringify(info)
        );
      } else {
        AirDAOCryptoLog.log(
          'TrxNodeInfoProvider.getLastBlock currentBlock warning ' +
            JSON.stringify(info)
        );
      }
    } catch (e: any) {
      AirDAOCryptoLog.log(
        'TrxNodeInfoProvider.getLastBlock currentBlock error ' + e.message
      );
    }
    return CACHE_LAST_BLOCK;
  }
}
