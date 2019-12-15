'use strict';

// Will allow SLS YML environment variables to be available in tests.
require('dotenv').config()

let initialized = false;

let init = function () {
  // If global variable already exists from other tests, skip.
  if (initialized) {
    return;
  }

  console.log("Initializing for tests ...");
  initialized = true;
}

module.exports.init = init;

