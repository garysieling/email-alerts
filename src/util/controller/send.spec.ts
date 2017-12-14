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

describe('testing ad blocks', function() {
  it('includes utm codes in links to ads', function() {
    assert.equal(true, false);
  });  

  it('includes ad block in all newsletter emails', function() {
    // loops over every newsletter
    assert.equal(true, false);
  });
  
  it('includes utm codes in all links to findlectures from newsletter', function() {
    // loops over every newsletter
    assert.equal(true, false);
  });

  it('includes utm codes in all links to findlectures from generated emails', function() {
    assert.equal(true, false);
  });

  it('includes ad block in all newsletter emails', function() {
    // loops over every newsletter
    assert.equal(true, false);
  });
  
  it('makes bitly links to ad references', function() {
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
  
  it('makes all the links in newsletters to findlectures', function() {
    // loops over every newsletter
    assert.equal(true, false);
  });
});