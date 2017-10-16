const assert = require('assert');
const _ = require('lodash');

import { 
  loadSent,
  loadAlerts,
  recordAlertSent
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
        assert.equal(true, data[2].lastSent.getFullYear() === 2017);
       
        done();
    });
  });

  it('loads index', function(done) {
    const data: any[] = [];
    loadAlerts(
      (cb: any, record: any) => {
        data.push(record);

        cb();
      },
      () => {
        assert.equal(true, data[2].index >= 0);
       
        done();
    });
  });

  it('index defaults to 0', function(done) {
    const data: any[] = [];
    loadAlerts(
      (cb: any, record: any) => {
        data.push(record);

        cb();
      },
      () => {
        assert.equal(true, data[2].index >= 0);
       
        done();
    });
  });

  it('index goes up', function(done) {
    const data1: any[] = [];
    loadAlerts(
      (cb1: any, record1: any) => {
        data1.push(record1);

        cb1();
      },
      () => {   
        recordAlertSent(data1[1], '17442', () => {
          const data2: any[] = [];

          loadAlerts(
            (cb2: any, record2: any) => {
              data2.push(record2);

              cb2();
            },
            () => {
              assert.equal(data1[1].index + 1, data2[1].index);
            }
          );
        })
        
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

  it('is loads failure', function(done) {
    const data: any[] = [];
    loadAlerts(
      (cb: any, record: any) => {
        data.push(record);

        cb();
      },
      () => {
        assert.equal(true, data[0].failure);
        
        done();
    });
  });
});

