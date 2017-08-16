const assert = require('assert');

import { 
  queryForLikeAndDislike,
  boostLike,
  boostDislike
} from './rules';

describe('NoRules - empty string', function() {
  describe('#queryForLikeAndDislike()', function() {
    it('valid solr query for no selections', function() {
      assert.equal("*:*", queryForLikeAndDislike("", ""));
    });
  });
});

describe('NoRules- null', function() {
  describe('#queryForLikeAndDislike()', function() {
    it('valid solr query for no selections', function() {
      assert.equal("*:*", queryForLikeAndDislike(null, null));
    });
  });
});

describe('NoRules - undefined', function() {
  describe('#queryForLikeAndDislike()', function() {
    it('valid solr query for no selections', function() {
      assert.equal("*:*", queryForLikeAndDislike(undefined, undefined));
    });
  });
});


describe('Spaces in positive', function() {
  describe('#queryForLikeAndDislike()', function() {
    it('valid solr query for positive query with a space', function() {
      assert.equal('"new%20jersey"', queryForLikeAndDislike("new jersey", undefined));
    });
  });
});

describe('spaces in negative', function() {
  describe('#queryForLikeAndDislike()', function() {
    it('valid solr query for negatives query with a space', function() {
      assert.equal('-("new%20jersey")', queryForLikeAndDislike(undefined, "new jersey"));
    });
  });
});

describe('two positive values', function() {
  describe('#queryForLikeAndDislike()', function() {
    it('valid solr query for query with a space', function() {
      assert.equal('"solr"%20OR%20"ai"', queryForLikeAndDislike("solr,ai", undefined));
    });
  });
});

describe('two negative values', function() {
  describe('#queryForLikeAndDislike()', function() {
    it('valid solr query for query with a space', function() {
      assert.equal('-("solr"%20AND%20"ai")', queryForLikeAndDislike(undefined, "solr,ai"));
    });
  });
});


describe('positive and negative', function() {
  describe('#queryForLikeAndDislike()', function() {
    it('valid solr query positive and negative', function() {
      assert.equal('("javascript"%20OR%20"npm")%20-("solr"%20AND%20"ai")', queryForLikeAndDislike("javascript,npm", "solr,ai"));
    });
  });
});



describe('boost - like', function() {
  describe('#queryForLikeAndDislike()', function() {
    it('valid solr query positive and negative', function() {
      assert.equal('article:javascript^1%20article:npm^1', 
        boostLike("article", [{
          term: "javascript", 
          value: 1
        }, {
          term: "npm",
          value: 1
        }]));
    });
  });
});



describe('boost - dislike', function() {
  describe('#queryForLikeAndDislike()', function() {
    it('valid solr query positive and negative', function() {
      assert.equal('article:javascript^0.1%20article:npm^0.1', 
        boostDislike("article", [{
          term: "javascript", 
          value: 0.1
        }, {
          term: "npm",
          value: 0.1
        }]));
    });
  });
});
