/* eslint-env mocha */
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import Cron from '../src/Cron';

chai.use(sinonChai);
chai.should();

describe('Cron', () => {

  describe('Use Date Object', function() {

    var clock = sinon.useFakeTimers();
    var interval = 5;
    var date = new Date();
    date.setSeconds(date.getSeconds() + interval);

    var x = 1;
    var cronJob = new Cron(date, function(){
      x++;
    });
    cronJob.runScheduling();

    it('should have status running', () => {
      cronJob.getStatus().should.be.equal('Job is running');
    });

    it('should be run once after interval', () => {
      clock.tick(interval * 1000);
      x.should.be.equal(2);
      clock.tick(interval * 1000);
      x.should.be.equal(2);
    });

    it('should have status stopped', () => {
      cronJob.getStatus().should.be.equal('Job not running');
    });

  });

  describe('Use Date Object and overflow timeout', function() {

    var clock = sinon.useFakeTimers();
    var interval = 2147483647;
    var date = new Date();
    date.setMilliseconds(date.getMilliseconds() + interval + 1); // Overflow by 1 milliseconds

    var x1 = 1;
    var cronJob = new Cron(date, function(){
      x1++;
    });
    cronJob.runScheduling();

    it('should have status running', () => {
      cronJob.getStatus().should.be.equal('Job is running');
    });

    it('should be run once after interval', () => {
      clock.tick(interval);
      x1.should.be.equal(1);
      clock.tick(1);
      x1.should.be.equal(2);
    });

    it('should have status stopped', () => {
      cronJob.getStatus().should.be.equal('Job not running');
    });

  });

  describe('Use Cron Time rule', function() {

    // Run every 5 seconds
    var clock = sinon.useFakeTimers();
    var interval = 5;
    var y = 1;
    var cronJob = new Cron('*/5 * * * * *', function(){
      y++;
    });
    cronJob.runScheduling();

    it('should have status running', () => {
      cronJob.getStatus().should.be.equal('Job is running');
    });

    it('should be run every 5 seconds', () => {
      clock.tick(interval * 1000);
      y.should.be.equal(2);
      clock.tick(interval * 1000);
      clock.tick(interval * 1000);
      y.should.be.equal(4);
    });

    it('should have status running', () => {
      cronJob.getStatus().should.be.equal('Job is running');
    });

    it('should have status stopped', () => {
      cronJob.stop();
      cronJob.getStatus().should.be.equal('Job not running');
    });

  });

});
