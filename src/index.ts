let _ = require("lodash");

import {
  isTesting
} from './util/env'

import {
  loadSent
} from './util/email/storage'

function loadAlerts(cb: any) {
  console.log('loadAlerts');
  cb();
}

function sendAlert() {
  console.log('sendAlert');
}

function main() {
  console.log('main');
  // todo, for each email
  loadSent(
    'gary.sieling@gmail.com',
    (data: any) => {
      loadAlerts(sendAlert)
    }
  );
}

main();

export default main;