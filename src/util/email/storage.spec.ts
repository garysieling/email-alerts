const assert = require('assert');

import { 
  loadSent,
  loadAlerts
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

  // todo test caching
});

describe('Test alert listing', function() {
  it('is can retrieve a list of alerts', function(done) {
    const data: any[] = [];
    loadAlerts(
      (cb: any, record: any) => {
        data.push(record);

        cb();
      },
      () => {
        const emails: any = data.map(
          (row: any) => row.email
        );

        assert.equal(true, emails['includes']('gary.sieling@gmail.com'));

        done();
    });
  });
});

