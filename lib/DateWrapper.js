'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _cronParser = require('cron-parser');

var _cronParser2 = _interopRequireDefault(_cronParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DateWrapper = (function () {
  function DateWrapper(date) {
    _classCallCheck(this, DateWrapper);

    if (date instanceof Date) {
      this._dateType = DateWrapper.DATE_TYPE.DATE_OBJECT;
      this._date = date;
    } else {
      this._dateType = DateWrapper.DATE_TYPE.DATE_CRON;

      try {
        this._date = _cronParser2.default.parseExpression(date);
        // To force new job can't run immediately
        this._date.next();
      } catch (e) {
        throw new TypeError('Failed to parse cron schedule rule');
      }
    }
  }

  _createClass(DateWrapper, [{
    key: 'isRepetitive',
    value: function isRepetitive() {
      switch (this._dateType) {
        case DateWrapper.DATE_TYPE.DATE_CRON:
          return true;
        default:
          return false;
      }
    }
  }, {
    key: 'next',
    value: function next() {
      switch (this._dateType) {
        case DateWrapper.DATE_TYPE.DATE_CRON:
          return this._date.next();
        default:
          return this._date;
      }
    }
  }], [{
    key: 'DATE_TYPE',
    get: function get() {
      return {
        DATE_OBJECT: 'dateObject',
        DATE_CRON: 'dateCron'
      };
    }
  }]);

  return DateWrapper;
})();

exports.default = DateWrapper;