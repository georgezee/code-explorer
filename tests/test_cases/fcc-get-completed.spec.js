'use strict';

const when = require('../steps/when');
const init = require('../steps/init').init;

describe("Check fetching of FCC points",function () {
  beforeAll(
    function () {
      init();
    }
  );

  test('Should return a valid response with points and projects', async function () {
    let response = await when.we_invoke_fcc_get_completed('miriamjinx');
    expect(response.statusCode).toBe(200);
    let result = JSON.parse(response.body);
    expect(typeof result.points).toBe('number')
    expect(typeof result.projects).toBe('number')
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