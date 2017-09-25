const assert = require('assert');

import { isEligible } from './schedule';

describe('isEligibleAfterAWeekButNotAtMidnight', function() {
  it('should be true when today is monday', function() {
    
    const testDay = new Date(Date.parse("August 14, 2017 12:00 AM"));
    const lastSent = new Date(Date.parse("August 7, 2017"));
    const lastEligible = new Date(Date.parse("August 7, 2017"));

    assert.equal(false, isEligible(testDay, lastSent, lastEligible));
  });
});

describe('not eligible on an invalid date', function() {
  it('not eligible on a sunday when previously sent', function() {
      assert.equal(false, isEligible(
        new Date(1506300103664),
        new Date(1502679303810),
        new Date(17433 * 3600 * 1000)
      ))
  });
});

describe('isEligibleAfterAWeekButNotTooEarly', function() {
  it('should be true when today is monday', function() {
    
    const testDay = new Date(Date.parse("August 14, 2017 7:00 AM"));
    const lastSent = new Date(Date.parse("August 7, 2017"));
    const lastEligible = new Date(Date.parse("August 7, 2017"));

    assert.equal(false, isEligible(testDay, lastSent, lastEligible));
  });
});

describe('isEligibleAfterAWeek', function() {
  it('should be true when today is monday', function() {
    
    const testDay = new Date(Date.parse("August 14, 2017 9:00 AM"));
    const lastSent = new Date(Date.parse("August 7, 2017"));
    const lastEligible = new Date(Date.parse("August 7, 2017"));

    assert.equal(true, isEligible(testDay, lastSent, lastEligible));
  });
});

describe('isEligibleAfterAWeekWithTime', function() {
  it('should be true when today is monday', function() {
    
    const testDay = new Date(Date.parse("August 14, 2017 10:07 PM"));
    const lastSent = new Date(Date.parse("August 7, 2017 9:14 PM"));
    const lastEligible = new Date(Date.parse("August 7, 2017 7:56 PM"));

    assert.equal(true, isEligible(testDay, lastSent, lastEligible)); // TODO
  });
});

describe('isEligibleWhenSignedUpRecently', function() {
  it('should be true when today is monday', function() {
    
    const testDay = new Date(Date.parse("August 14, 2017 9:00 AM"));
    const lastSent = new Date(Date.parse("August 10, 2017"));
    const lastEligible = new Date(Date.parse("August 7, 2017"));

    assert.equal(true, isEligible(testDay, lastSent, lastEligible));
  });
});

describe('isEligibleWhenSignedUpRecentlyWithTime', function() {
  it('should be true when today is monday', function() {
    
    const testDay = new Date(Date.parse("August 14, 2017 10:07 PM"));
    const lastSent = new Date(Date.parse("August 10, 2017 9:14 PM"));
    const lastEligible = new Date(Date.parse("August 7, 2017 7:56 PM"));

    assert.equal(true, isEligible(testDay, lastSent, lastEligible));// TODO
  });
});

describe('isEligibleIfNeverSentTodayIsMonday', function() {
  it('should be true when today is monday', function() {
    
    const testDay = new Date(Date.parse("August 14, 2017 9:00 AM"));
    const lastSent: Date = undefined;
    const lastEligible: Date = undefined;

    assert.equal(true, isEligible(testDay, lastSent, lastEligible));
  });
});

describe('isEligibleIfNeverSentTodayIsNotMonday', function() {
  it('should be true when today is monday', function() {
    
    const testDay = new Date(Date.parse("August 13, 2017 9:00 AM"));
    const lastSent: Date = undefined;
    const lastEligible: Date = undefined;

    assert.equal(true, isEligible(testDay, lastSent, lastEligible));
  });
});

describe('isEligibleIfAWeekDefectivelySkipped', function() {
  it('should be true when today is monday', function() {
    
    const testDay = new Date(Date.parse("August 21, 2017 9:00 AM"));
    const lastSent = new Date(Date.parse("August 7, 2017"));
    const lastEligible = new Date(Date.parse("August 7, 2017"));

    assert.equal(true, isEligible(testDay, lastSent, lastEligible));
  });
});
