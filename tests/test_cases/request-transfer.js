'use strict';

const expect = require('chai').expect;
const when = require('../steps/when');
const init = require('../steps/init').init;

describe("When we invoke the GET endpoint", function () {
  before(
    function () {
      init();
    }
  );

  it('Should return a valid response', async function () {
    let res = await when.we_invoke_request_transfer();
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.include("Message sent");
  });
});