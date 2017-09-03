const assert = require('assert');

import { 
  isTesting
} from './env';

describe('Test for production/testing modes', function() {
  describe('test false', function() {
    it('is false if false', function() {
      process.env.IS_PRODUCTION = 'false';

      assert.equal(true, isTesting());
    });
  });

  describe('test true', function() {
    process.env.IS_PRODUCTION = 'true';

    it('is true if true', function() {
      assert.equal(true, isTesting());
    });

    process.env.IS_PRODUCTION = 'false';
  });
});
