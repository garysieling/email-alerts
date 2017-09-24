const assert = require('assert');
const _ = require('lodash');

import { 
  loadSent,
  loadAlerts
} from './storage';

describe('Test for sent emails', function() {
  it('is can retrieve data', function(done) {
    loadSent('gary.sieling@gmail.com', 
      (data: string[]) => {
        console.log(data);
          assert.equal(true, _.includes(data, '87159'));

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

  it('loads lastSent', function(done) {
    const data: any[] = [];
    loadAlerts(
      (cb: any, record: any) => {
        data.push(record);

        cb();
      },
      () => {
        assert.equal(true, data[1].lastSent.getFullYear() === 2017);
       
        done();
    });
  });

  it('loads likes', function(done) {
    const data: any[] = [];
    loadAlerts(
      (cb: any, record: any) => {
        data.push(record);

        cb();
      },
      () => {
        assert.equal(true, _.isEqual(["machine learning", "github"], data[1].like));
       
        done();
    });
  });

  it('loads dislikes', function(done) {
    const data: any[] = [];
    loadAlerts(
      (cb: any, record: any) => {
        data.push(record);

        cb();
      },
      () => {
        assert.equal(true, _.isEqual(["new jersey", "politics"], data[1].dislike));
       
        done();
    });
  });

  it('loads created', function(done) {
    const data: any[] = [];
    loadAlerts(
      (cb: any, record: any) => {
        data.push(record);

        cb();
      },
      () => {
        assert.equal(true, data[1].created.getFullYear() === 2017);
        
        done();
    });
  });

  
  it('loads lastEligible', function(done) {
    const data: any[] = [];
    loadAlerts(
      (cb: any, record: any) => {
        data.push(record);

        cb();
      },
      () => {
        assert.equal(true, data[1].lastEligible.getFullYear() === 2017);
        
        done();
    });
  });

  it('is loads unsubscribe', function(done) {
    const data: any[] = [];
    loadAlerts(
      (cb: any, record: any) => {
        data.push(record);

        cb();
      },
      () => {
        assert.equal(true, data[0].unsubscribed);
        
        done();
    });
  });
});

