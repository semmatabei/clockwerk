/* eslint-env mocha */
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import Cron from '../src/Cron';

chai.use(sinonChai);
chai.should();

describe('Cron', () => {

  it('Use Date Object', () => {
    let clock = sinon.useFakeTimers();
    let interval = 5;
    let date = new Date();
    date.setSeconds(date.getSeconds() + interval);

    let x = 1;
    let cronJob = new Cron('new Date Job', date, () => {
      x++;
    },() => {
      clock.restore();
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

  it('Use Cron Time rule', function() {

    // Run every 5 seconds
    let clock = sinon.useFakeTimers();
    let interval = 5;
    let y = 1;
    let cronJob = new Cron('Cron Time Job', '*/5 * * * * *', () => {
      y++;
    },function(){
      clock.restore();
    });
    cronJob.runScheduling();

    it('should have status running', () => {
      cronJob.getStatus().should.be.equal('Job is running');
    });

    it('should be run every 5 seconds', () => {
      clock.tick(interval * 1000);
      y.should.be.equal(2);
      clock.tick(interval * 1000 + interval * 1000);
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

  it('Use Date Object and overflow timeout', () => {

    let clock = sinon.useFakeTimers();
    let interval = 2147483647;
    let date = new Date();
    date.setMilliseconds(date.getMilliseconds() + interval + 1); // Overflow by 1 milliseconds

    let cronJob = new Cron('Overflow Job', date, () => { });
    cronJob.runScheduling();
    clock.tick(1);

    it('should have status stopped', () => {
      cronJob.getStatus().should.be.equal('Job not running');
    });

  });

  it('Use Past Date Object', () => {

    sinon.useFakeTimers();
    let date = new Date();
    date.setHours(date.getHours() - 1);

    let cronJob = new Cron('Overflow Job', date, () => { });
    cronJob.runScheduling();

    it('should have status stopped', () => {
      cronJob.getStatus().should.be.equal('Job not running');
    });

  });

});
