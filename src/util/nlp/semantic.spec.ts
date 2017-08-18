const assert = require('assert');
import * as _ from 'lodash';

import {
  initializeDatabase,
  closeWords
} from './semantic';

describe('word2vec', function() {
  it('can open a sqlite database', function() {
    initializeDatabase();
    
    assert.equal(true, true);
  });

  it('can find words', function() {
    closeWords(
      'java',
      (results) => {
        assert.equal(results.length > 0 && _.isArray(results));
      }
    )    
  });
});
