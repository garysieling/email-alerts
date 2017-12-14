const assert = require('assert');

import { 
  saveRequestToFile,
  sendAlerts
} from './send';

describe('sends one email per id', function() {
  it('sends one email per id', function() {
    assert.equal(true, false);
  });
});


describe('does not send the same id twice across emails', function() {
  it('sends one email per id', function() {
    assert.equal(true, false);
  });
});


describe('sends newsletter content to people with no requests', function() {
  it('sends first email when someone signs up', function() {
    assert.equal(true, false);
  });

  it('sends second email a week later', function() {
    assert.equal(true, false);
  });
});