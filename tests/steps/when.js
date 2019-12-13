'use strict';

const APP_ROOT = '../../';

let we_invoke_request_transfer = function() {
  let parameters = require(`${APP_ROOT}/examples/request-transfer.json`);
  let handler = require(`${APP_ROOT}/functions/request-transfer`).handler;

  return new Promise((resolve, reject) => {
    let context = {};
    let callback = function(err, response) {
      if (err) {
        reject(err);
      } else {
        resolve(response);
      }
    };

    handler(parameters, context, callback);

  });
}

let we_invoke_fcc_get_completed = function() {
  let parameters = require(`${APP_ROOT}/examples/fcc-get-completed.json`);
  let handler = require(`${APP_ROOT}/functions/fcc-get-completed`).handler;

  return new Promise((resolve, reject) => {
    let context = {};
    let callback = function(err, response) {
      if (err) {
        reject(err);
      } else {
        resolve(response);
      }
    };

    handler(parameters, context, callback);

  });
}

module.exports = {
  we_invoke_request_transfer,
  we_invoke_fcc_get_completed
}