let _ = require("lodash");

import {
  isTesting
} from './util/env'

import {
  loadAlerts,
  loadSent
} from './util/email/storage'

function sendAlert() {
  console.log('sendAlert');
}

function main() {
  console.log('main');
  // todo, for each email
  loadAlerts(
    (cb: any, data: any) => {
      loadSent(
          data.email,
          () => {
            cb();
          }
        )
    }, 
    (all: any[]) => {

    }
  );
}

main();

export default main;