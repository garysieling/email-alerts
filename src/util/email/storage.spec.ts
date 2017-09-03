const assert = require('assert');

import { 
  loadSent
} from './storage';

describe('Test for sent emails', function() {
  it('is can retrieve data', function(done) {
    loadSent('gary.sieling@gmail.com', 
      (data: any) => {
          assert.equal(true, data.includes('87159'));

          done();
        });
      }
    );
});
