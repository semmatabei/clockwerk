import DateWrapper from './DateWrapper.js';

/**
 * Schedule string:
 * *    *    *    *    *    *
 * ┬    ┬    ┬    ┬    ┬    ┬
 * │    │    │    │    │    |
 * │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
 * │    │    │    │    └───── month (1 - 12)
 * │    │    │    └────────── day of month (1 - 31)
 * │    │    └─────────────── hour (0 - 23)
 * │    └──────────────────── minute (0 - 59)
 * └───────────────────────── second (0 - 59, OPTIONAL)
 */

export default class Cron {

  /**
   *
   * @param {string|Date} schedule
   * @param {Function} action
   */
  constructor(schedule, action) {
    this.CRON_STATUS = {
      RUNNING: 'running',
      STOPPED: 'stopped'
    };

    this._action = action;
    this._schedule = new DateWrapper(schedule);

    this._remainingTime = 0;
    this._timeoutCalculated = false;
  }

  runScheduling() {
    this._status = this.CRON_STATUS.RUNNING;
    var timeout = this._getTimeout();

    if (timeout >= 0) {
      if (timeout > 0) {
        this._timeoutAction = setTimeout(() => this.runScheduling(), timeout);
      } else {
        this.executeAction();
      }
    } else {
      this.stop();
    }
  }

  executeAction() {
    this._action();
    // So next _getTimeout will calculate new schedule for next run cycle
    this._timeoutCalculated = false;
    // Make sure un-repetitive job will not call runScheduling after executed
    if (this._schedule.isRepetitive()) {
      this.runScheduling();
    } else {
      this.stop();
    }
  }

  // Always return
  _getTimeout() {
    var MAX_DELAY = 2147483647;
    let timeout = 0;

    if (!this._timeoutCalculated) {
      // Set back to false after run action
      this._timeoutCalculated = true;

      let nextTime = this._schedule.next();
      let currentTime = new Date();

      if (this._schedule.isRepetitive()) {
        while (nextTime < currentTime) {
          // keep incr the schedule until it's in the future
          nextTime = this._schedule.next();
        }
      }

      this._remainingTime = Math.max(-1, nextTime - currentTime);
    }

    if (this._remainingTime > 0) {
      if (this._remainingTime > MAX_DELAY) {
        this._remainingTime -= MAX_DELAY;
        timeout = MAX_DELAY;
      } else {
        timeout = this._remainingTime;
        this._remainingTime = 0;
      }
    } else {
      // Will stop the cron job if next schedule is in the past
      timeout = this._remainingTime;
    }

    return timeout;
  }

  stop() {
    if (this._timeoutAction) {
      clearTimeout(this._timeoutAction);
    }
    this._status = this.CRON_STATUS.STOPPED;
  }

  getStatus() {
    switch (this._status) {
      case this.CRON_STATUS.RUNNING: return 'Job is running';
      case this.CRON_STATUS.STOPPED: return 'Job not running';
      default: return 'Status unrecognized';
    }
  }

}

