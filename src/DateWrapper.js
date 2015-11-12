import CronParser from 'cron-parser';

export default class DateWrapper {

  constructor(date) {
    if (date instanceof Date) {
      this._dateType = DateWrapper.DATE_TYPE.DATE_OBJECT;
      this._date = date;
    } else {
      this._dateType = DateWrapper.DATE_TYPE.DATE_CRON;

      try {
        this._date = CronParser.parseExpression(date);
        // To force new job can't run immediately
        this._date.next();
      } catch (e) {
        throw new TypeError('Failed to parse cron schedule rule');
      }
    }
  }

  static get DATE_TYPE() {
    return {
      DATE_OBJECT: 'dateObject',
      DATE_CRON: 'dateCron'
    };
  }

  isRepetitive() {
    switch (this._dateType) {
      case DateWrapper.DATE_TYPE.DATE_CRON: return true;
      default: return false;
    }
  }

  next() {
    switch (this._dateType) {
      case DateWrapper.DATE_TYPE.DATE_CRON: return this._date.next();
      default: return this._date;
    }
  }

}
