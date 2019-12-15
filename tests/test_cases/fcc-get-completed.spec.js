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
    let response = await when.we_invoke_fcc_get_completed('georgezee');
    expect(response.statusCode).toBe(200);
    let result = JSON.parse(response.body);
    expect(Number.isNaN(result.points)).toBe(false);
  });

  test('Should return an error for invalid users', async function () {
    let response = await when.we_invoke_fcc_get_completed('not-a-real-user');
    let result = JSON.parse(response.body);
    expect(response.statusCode).toBe(400);
    expect(result.message).toMatch(/No profile/);
  });
});

// Sample code for tests.
// describe(`Test FCC get completed`, () => {
//   beforeAll(() => {
//   });

//   afterEach(() => {
//   });

//   afterAll(() => {
//   });

//   test(`First test example`, () => {
//     const response = "cool";
//     expect(response).toBe('cool');
//   });
// });