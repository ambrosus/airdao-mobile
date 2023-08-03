class AirDAOPrettyStrings {
  makeCut(str: string, size = 5, sizeEnd = false) {
    if (!str) return str;

    const ln = str.length;
    if (!sizeEnd || sizeEnd === 0) {
      sizeEnd = size;
    }
    if (ln < size + sizeEnd + 3) return str;
    return str.substring(0, size) + '...' + str.substring(ln - sizeEnd);
  }

  makeFromTrustee(link: any) {
    let linkUrl = link;
    if (linkUrl.indexOf('harmony.one') !== -1) {
      return linkUrl;
    }
    if (linkUrl.indexOf('?') === -1) {
      linkUrl += '?from=trustee';
    }
    return linkUrl;
  }
}

export default new AirDAOPrettyStrings();
