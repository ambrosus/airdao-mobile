/**
 * Separated log class for crypto module - could be encoded here later
 * @version 0.9
 */

class AirDAOCryptoLog {
  private _txtOrObj: string | undefined;
  private _txtOrObj2: boolean | undefined;
  private _txtOrObj3: boolean | undefined;
  private _errorObjectOrText: string | undefined;
  private _errorObject2: string | undefined;
  private _errorTitle: string | undefined;
  constructor() {}

  async log(txtOrObj: string, txtOrObj2 = false, txtOrObj3 = false) {
    this._txtOrObj = txtOrObj;
    this._txtOrObj2 = txtOrObj2;
    this._txtOrObj3 = txtOrObj3;
    return true;
  }

  async err(
    errorObjectOrText: string,
    errorObject2 = '',
    errorTitle = 'ERROR'
  ) {
    this._errorObjectOrText = errorObjectOrText;
    this._errorObject2 = errorObject2;
    this._errorTitle = errorTitle;
    return true;
  }
}

export default new AirDAOCryptoLog();
