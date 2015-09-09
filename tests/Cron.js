/* eslint-env mocha */
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import Cron from '../src/Cron';

chai.use(sinonChai);
chai.should();

describe('Cron', () => {

  describe('Use Date Object', () => {

    var clock = sinon.useFakeTimers();
    var interval = 5;
    var date = new Date();
    date.setSeconds(date.getSeconds() + interval);

    var x = 1;
    var cronJob = new Cron(date, function(){
      x++;
    });
    cronJob.runScheduling();

    it('should be run once after interval', () => {

      clock.tick(interval * 1000);
      x.should.be.equal(2);
      clock.tick(interval * 1000);
      x.should.be.equal(2);

    });

  });

  describe('Use Cron Time rule', () => {

    // Run every 5 seconds
    var clock = sinon.useFakeTimers();
    var interval = 5;
    var y = 1;
    var cronJob = new Cron('*/5 * * * * *', function(){
      y++;
    });
    cronJob.runScheduling();

    it('should be run every 5 seconds', () => {

      clock.tick(interval * 1000);
      y.should.be.equal(2);
      clock.tick(interval * 1000);
      clock.tick(interval * 1000);
      y.should.be.equal(4);

    });

  });

});
