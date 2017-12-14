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


describe('includes the right things', function() {
  it('does not send the same id twice across emails', function() {
    assert.equal(true, false);
  });

  it('includes ad block in machine generated emails', function() {
    assert.equal(true, false);
  });
});


describe('sends newsletter content to people with no requests', function() {
  it('sends first email when someone signs up', function() {
    assert.equal(true, false);
  });

  it('sends second email a week later', function() {
    // loop over every newsletter / index
    assert.equal(true, false);
  });

  it('includes ad block in all newsletter emails', function() {
    // loops over every newsletter
    assert.equal(true, false);
  });
});