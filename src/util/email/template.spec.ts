const assert = require('assert');

import { 
  buildEmail,
  formatLength
} from './template';

describe('Test length formatting', function() {
  it('it can do minutes', function() {
    assert.equal("18 minutes", formatLength(60*18));
  });

  it('it can do minutes', function() {
    assert.equal("60 minutes", formatLength(3600));
  });

  it('it can do partial hours 1', function() {
    assert.equal("1.5 hours", formatLength(3600*1.5));
  });

  it('it can do partial hours 2', function() {
    assert.equal("61 minutes", formatLength(3660));
  });

  it('it can do single minute', function() {
    assert.equal("1 minute", formatLength(60));
  });

  it('it can do single minute', function() {
    assert.equal("0 minutes", formatLength(0));
  });
});

describe('Test templating', function() {
  it('text template includes unsubscribe link', function() {
    assert.equal(
      "https://www.findlectures.com/alert-unsubscribe?id=testID", 
      buildEmail(
        {
          identifier: "testID",
          email: "",
          like: [],
          dislike: []
        },
        "",
        "{unsubscribeUrl}",        
        [],
        []
      ).textEmail
    );
  });

  it('html template includes unsubscribe link', function() {
  assert.equal(
      "https://www.findlectures.com/alert-unsubscribe?id=testID", 
      buildEmail(
        {
          identifier: "testID",
          email: "",
          like: [],
          dislike: []
        },
        "{unsubscribeUrl}",
        "",
        [],
        []
      ).htmlEmail
    );  });
});

// todo test email tmemplating
// test all the appropriate variables are in each template
// test text template is text, and vice versa
// test each variable sorta works