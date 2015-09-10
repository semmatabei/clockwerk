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
   * @param {string} name
   * @param {string|Date} schedule
   * @param {Function} action
   * @param {Function=} onComplete
   */
  constructor(name, schedule, action, onComplete) {
    this._name = name;
    this._action = action;
    this._schedule = new DateWrapper(schedule);
    if (onComplete) {
      this._onComplete = onComplete;
    }

    this._timeoutCalculated = false;
  }

  static get CRON_STATUS() {
    return {
      RUNNING: 'running',
      STOPPED: 'stopped'
    };
  }

  runScheduling() {
    this._status = Cron.CRON_STATUS.RUNNING;
    var timeout = this._getTimeout();
    if (timeout >= 0) {
      this._timeoutAction = setTimeout(() => this.executeAction(), timeout);
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

  /**
   * Possible return :
   * < 0 : Will stop the cron for single run task. Will get next schedule for repetitive task
   * >= 0 : Will setTimeout to execute action
   *
   * @returns {number}
   * @private
   */
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
          // keep increment the schedule until it's > current time, this means the timeout returned for repetitive task will never < 0
          nextTime = this._schedule.next();
        }
      }

      timeout = Math.max(-1, nextTime - currentTime);
    }

    if (timeout > MAX_DELAY) {
      timeout = -1;
    }

    return timeout;
  }

  stop() {
    if (this._timeoutAction) {
      clearTimeout(this._timeoutAction);

      if (this._onComplete) {
        this._onComplete();
      }
    }
    this._status = Cron.CRON_STATUS.STOPPED;
  }

  getStatus() {
    switch (this._status) {
      case Cron.CRON_STATUS.RUNNING: return 'Job is running';
      default: return 'Job not running';
    }
  }

}

