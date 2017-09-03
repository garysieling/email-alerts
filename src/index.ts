let _ = require("lodash");

import {
  isTesting
} from './util/env'

let isTesting = getIsTesting();

function loadAlerts(cb) {
}

function loadSent(cb) {
}

loadSent(
  () => {
    loadAlerts(sendAlert)
  }
);