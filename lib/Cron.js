'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _DateWrapper = require('./DateWrapper.js');

var _DateWrapper2 = _interopRequireDefault(_DateWrapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

var Cron = (function () {

  /**
   *
   * @param {string} name
   * @param {string|Date} schedule
   * @param {Function} action
   * @param {Function=} onComplete
   */

  function Cron(name, schedule, action, onComplete) {
    _classCallCheck(this, Cron);

    this._name = name;
    this._action = action;
    this._schedule = new _DateWrapper2.default(schedule);
    if (onComplete) {
      this._onComplete = onComplete;
    }

    this._timeoutCalculated = false;
  }

  _createClass(Cron, [{
    key: 'runScheduling',
    value: function runScheduling() {
      var _this = this;

      this._status = Cron.CRON_STATUS.RUNNING;
      var timeout = this._getTimeout();
      if (timeout >= 0) {
        this._timeoutAction = setTimeout(function () {
          return _this.executeAction();
        }, timeout);
      } else {
        this.stop();
      }
    }
  }, {
    key: 'executeAction',
    value: function executeAction() {
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

  }, {
    key: '_getTimeout',
    value: function _getTimeout() {
      var MAX_DELAY = 2147483647;
      var timeout = 0;

      if (!this._timeoutCalculated) {
        // Set back to false after run action
        this._timeoutCalculated = true;

        var nextTime = this._schedule.next();
        var currentTime = new Date();

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
  }, {
    key: 'stop',
    value: function stop() {
      if (this._timeoutAction) {
        clearTimeout(this._timeoutAction);

        if (this._onComplete) {
          this._onComplete();
        }
      }
      this._status = Cron.CRON_STATUS.STOPPED;
    }
  }, {
    key: 'getStatus',
    value: function getStatus() {
      switch (this._status) {
        case Cron.CRON_STATUS.RUNNING:
          return 'Job is running';
        default:
          return 'Job not running';
      }
    }
  }], [{
    key: 'CRON_STATUS',
    get: function get() {
      return {
        RUNNING: 'running',
        STOPPED: 'stopped'
      };
    }
  }]);

  return Cron;
})();

exports.default = Cron;