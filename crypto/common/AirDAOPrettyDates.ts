import config from '@constants/config';

class AirDAOPrettyDates {
  timestampToPretty(str: string | number | Date) {
    try {
      const datetime = new Date(str);
      return (
        datetime.toTimeString().slice(0, 8) +
        ' ' +
        (datetime.getDate().toString().length === 1
          ? '0' + datetime.getDate()
          : datetime.getDate()) +
        '/' +
        ((datetime.getMonth() + 1).toString().length === 1
          ? '0' + (datetime.getMonth() + 1)
          : datetime.getMonth() + 1) +
        '/' +
        datetime.getFullYear()
      );
    } catch (e: any) {
      if (config.debug.appErrors) {
        console.log(
          'BlocksoftPrettyDates.timestampToPretty ' +
            str +
            ' error ' +
            e.message
        );
      }
      return '';
    }
  }
}

export default new AirDAOPrettyDates();
