const assert = require('assert');

import { 
  buildEmail,
  formatLength,
  getHtmlTemplate,
  getTextTemplate
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

  it('text template includes alertId', function() {
    assert.equal(
      "emailId", 
      buildEmail(
        {
          identifier: "emailId",
          email: "",
          like: [],
          dislike: []
        },
        "",
        "{alertId}",        
        [],
        []
      ).textEmail
    );
  });

  it('html template includes includes alertId', function() {
  assert.equal(
      "emailId", 
      buildEmail(
        {
          identifier: "emailId",
          email: "gary.sieling@gmail.com",
          like: [],
          dislike: []
        },
        "{alertId}",
        "",
        [],
        []
      ).htmlEmail
   );
  });

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
    );      
  });

  /*
  // todo
   /{alertId}/g,
          alertId
        ).replace(
        ).replace(
          /{email}/g,
          email
        ).replace(
          /{emailId}/g,
          emailId
        ).replace(
          /{links}/g, 
          links
          */
});

describe('Test templates', function() {
  it('html template has unsubscribe link', function() {
    assert.equal(true, getHtmlTemplate().indexOf("{unsubscribeUrl}") > 0);
  });

  it('text template has unsubscribe link', function() {
    assert.equal(true, getTextTemplate().indexOf("{unsubscribeUrl}") > 0);
  });

  it('html template has spot for links', function() {
    assert.equal(true, getHtmlTemplate().indexOf("{links}") > 0);
  });

  it('text template has spot for links', function() {
    assert.equal(true, getTextTemplate().indexOf("{links}") > 0);
  });

  
  it('html template has spot for emailId', function() {
    assert.equal(true, getHtmlTemplate().indexOf("{emailId}") > 0);
  });

  it('text template has spot for emailId', function() {
    assert.equal(true, getTextTemplate().indexOf("{emailId}") > 0);
  });
  
  it('html template has spot for email address', function() {
    assert.equal(true, getHtmlTemplate().indexOf("{email}") > 0);
  });

  it('text template has spot for email address', function() {
    assert.equal(true, getTextTemplate().indexOf("{email}") > 0);
  });
    
  it('html template has no double {{', function() {
    assert.equal(true, getHtmlTemplate().indexOf("{{") < 0);
  });

  it('text template has no double {{', function() {
    assert.equal(true, getTextTemplate().indexOf("{{") < 0);
  });

  it('html template has no double }}', function() {
    assert.equal(true, getHtmlTemplate().indexOf("}}") < 0);
  });

  it('text template has no double }}', function() {
    assert.equal(true, getTextTemplate().indexOf("}}") < 0);
  });

  it('text template has no html', function() {
    assert.equal(true, getTextTemplate().indexOf("<br />") < 0);
  });

  it('text template has no html', function() {
    assert.equal(true, getHtmlTemplate().indexOf("<br />") >= 0);
  });
});

// todo test email tmemplating
