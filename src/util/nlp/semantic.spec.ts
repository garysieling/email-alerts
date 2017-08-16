const assert = require('assert');

import {
  initializeDatabase
} from './semantic';

describe('word2vec', function() {
  it('can open a sqlite database', function() {
    initializeDatabase();
    
    assert.equal(true, true);
  });
});
