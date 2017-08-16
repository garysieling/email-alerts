const assert = require('assert');

import { isEligible } from './schedule';

describe('isEligibleAfterAWeekButNotAtMidnight', function() {
  describe('#isEligible()', function() {
    it('should be true when today is monday', function() {
      
      const testDay = new Date(Date.parse("August 14, 2017 12:00 AM"));
      const lastSent = new Date(Date.parse("August 7, 2017"));
      const lastEligible = new Date(Date.parse("August 7, 2017"));

      assert.equal(false, isEligible(testDay, lastSent, lastEligible));
    });
  });
});

describe('isEligibleAfterAWeekButNotTooEarly', function() {
  describe('#isEligible()', function() {
    it('should be true when today is monday', function() {
      
      const testDay = new Date(Date.parse("August 14, 2017 7:00 AM"));
      const lastSent = new Date(Date.parse("August 7, 2017"));
      const lastEligible = new Date(Date.parse("August 7, 2017"));

      assert.equal(false, isEligible(testDay, lastSent, lastEligible));
    });
  });
});

describe('isEligibleAfterAWeek', function() {
  describe('#isEligible()', function() {
    it('should be true when today is monday', function() {
      
      const testDay = new Date(Date.parse("August 14, 2017 9:00 AM"));
      const lastSent = new Date(Date.parse("August 7, 2017"));
      const lastEligible = new Date(Date.parse("August 7, 2017"));

      assert.equal(true, isEligible(testDay, lastSent, lastEligible));
    });
  });
});

describe('isEligibleAfterAWeekWithTime', function() {
  describe('#isEligible()', function() {
    it('should be true when today is monday', function() {
      
      const testDay = new Date(Date.parse("August 14, 2017 10:07 PM"));
      const lastSent = new Date(Date.parse("August 7, 2017 9:14 PM"));
      const lastEligible = new Date(Date.parse("August 7, 2017 7:56 PM"));

      assert.equal(true, isEligible(testDay, lastSent, lastEligible)); // TODO
    });
  });
});

describe('isEligibleWhenSignedUpRecently', function() {
  describe('#isEligible()', function() {
    it('should be true when today is monday', function() {
      
      const testDay = new Date(Date.parse("August 14, 2017 9:00 AM"));
      const lastSent = new Date(Date.parse("August 10, 2017"));
      const lastEligible = new Date(Date.parse("August 7, 2017"));

      assert.equal(true, isEligible(testDay, lastSent, lastEligible));
    });
  });
});

describe('isEligibleWhenSignedUpRecentlyWithTime', function() {
  describe('#isEligible()', function() {
    it('should be true when today is monday', function() {
      
      const testDay = new Date(Date.parse("August 14, 2017 10:07 PM"));
      const lastSent = new Date(Date.parse("August 10, 2017 9:14 PM"));
      const lastEligible = new Date(Date.parse("August 7, 2017 7:56 PM"));

      assert.equal(true, isEligible(testDay, lastSent, lastEligible));// TODO
    });
  });
});

describe('isEligibleIfNeverSentTodayIsMonday', function() {
  describe('#isEligible()', function() {
    it('should be true when today is monday', function() {
      
      const testDay = new Date(Date.parse("August 14, 2017 9:00 AM"));
      const lastSent: Date = undefined;
      const lastEligible: Date = undefined;

      assert.equal(true, isEligible(testDay, lastSent, lastEligible));
    });
  });
});

describe('isEligibleIfNeverSentTodayIsNotMonday', function() {
  describe('#isEligible()', function() {
    it('should be true when today is monday', function() {
      
      const testDay = new Date(Date.parse("August 13, 2017 9:00 AM"));
      const lastSent: Date = undefined;
      const lastEligible: Date = undefined;

      assert.equal(true, isEligible(testDay, lastSent, lastEligible));
    });
  });
});

describe('isEligibleIfAWeekDefectivelySkipped', function() {
  describe('#isEligible()', function() {
    it('should be true when today is monday', function() {
      
      const testDay = new Date(Date.parse("August 21, 2017 9:00 AM"));
      const lastSent = new Date(Date.parse("August 7, 2017"));
      const lastEligible = new Date(Date.parse("August 7, 2017"));

      assert.equal(true, isEligible(testDay, lastSent, lastEligible));
    });
  });
});
