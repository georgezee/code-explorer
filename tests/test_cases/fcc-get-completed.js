'use strict';

const expect = require('chai').expect;
const when = require('../steps/when');
const init = require('../steps/init').init;

describe("When we invoke the GET endpoint to get points",function () {
  before(
    function () {
      init();
    }
  );

  it('Should return a valid response with points', async function () {
    let res = await when.we_invoke_fcc_get_completed();
    expect(res.statusCode).to.equal(200);

  });
});