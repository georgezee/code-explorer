'use strict';

const when = require('../steps/when');
const init = require('../steps/init').init;

describe("Check fetching of FCC points",function () {
  let res;
  beforeAll(
    async (done) => {
      init();
      res = await when.we_invoke_fcc_get_completed();
      done();
    }
  );

  test('Should return a valid response', async function () {
    expect(res.statusCode).toBe(200);
  });

  test('Should return points as a number',  function () {
    expect(Number.isNaN(res.body.points)).toBe(false)
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