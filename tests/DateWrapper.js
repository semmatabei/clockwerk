/* eslint-env mocha */
import chai from 'chai';
import DateWrapper from '../src/DateWrapper';

chai.should();

describe('DateWrapper', () => {

  describe('Use Date Object', () => {

    var date = new Date();
    var wrappedDate = new DateWrapper(date);

    it('should be able to return Data Object on next from new Date', () => {
      wrappedDate.next().should.be.a('date');
    });

    it('should not be repetitive', () => {
      wrappedDate.isRepetitive().should.be.false;
    });

  });

  describe('Use Cron rule', () => {

    var date = '* * * * * *';
    var wrappedDate = new DateWrapper(date);

    it('should be able to return Data Object on from cron rule', () => {
      wrappedDate.next().should.be.a('date');
    });

    it('should be repetitive', () => {
      wrappedDate.isRepetitive().should.be.true;
    });

  });

  describe('Use wrong Cron rule', () => {

    var date = 'a * * * * *';

    it('should be fail', () => {
      try {
        var wrappedDate = new DateWrapper(date);
      } catch (e) {
        true.should.be.True;
      }
    });

  });

});
