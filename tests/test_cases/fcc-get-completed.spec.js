'use strict';

const when = require('../steps/when');
const init = require('../steps/init').init;

describe("Check fetching of FCC points",function () {
  beforeAll(
    function () {
      init();
    }
  );

  test('Should return a valid response with points', async function () {
    let res = await when.we_invoke_fcc_get_completed();
    expect(res.statusCode).toBe(200);

  });
});

describe(`Test FCC get completed`, () => {
  beforeAll(() => {
  });

  afterEach(() => {
  });

  afterAll(() => {
  });

  test(`First test example`, () => {

    // const event = eventStub;
    // const context = {};

    // const result = handler(event, context);
    // expect(result).resolves.toMatchSnapshot();
    const response = "cool";
    expect(response).toBe('cool');
  });
});