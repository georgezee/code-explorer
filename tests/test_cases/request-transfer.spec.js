'use strict';

const when = require('../steps/when');
const init = require('../steps/init').init;

describe("When we invoke the Request Transfer endpoint", function () {
  beforeAll(
    function () {
      init();
    }
  );

  it('Should return a valid response', async function () {
    let response = await when.we_invoke_request_transfer();

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatch(/Message sent/);
  });
});