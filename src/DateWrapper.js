import CronParser from 'cron-parser';

export default class DateWrapper {

  constructor(date) {
    this.DATE_TYPE = {
      DATE_OBJECT: 'dateObject',
      DATE_CRON: 'dateCron'
    };

    if (date instanceof Date) {
      this._dateType = this.DATE_TYPE.DATE_OBJECT;
      this._date = date;
    } else {
      this._dateType = this.DATE_TYPE.DATE_CRON;
      this._date = CronParser.parseExpression(date);
    }
  }

  isRepetitive() {
    switch (this._dateType) {
      case this.DATE_TYPE.DATE_OBJECT: return false;
      case this.DATE_TYPE.DATE_CRON: return true;
      default: return false;
    }
  }

  next() {
    switch (this._dateType) {
      case this.DATE_TYPE.DATE_OBJECT: return this._date;
      case this.DATE_TYPE.DATE_CRON: return this._date.next();
      default: return this._date;
    }
  }

}
