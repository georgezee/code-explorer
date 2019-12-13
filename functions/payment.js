'use strict';
const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = (event, context, callback) => {

  const username = "two";//event["queryStringParameters"]['user'] || 'unknown';
  const amountToPay = 50; //event["queryStringParameters"]['amount'] || 'unknown';

  function recordUserData(profileName, userAccount) {
    console.log('putting data');

    // Persist to DB.
    let itemProfile = {
        name: profileName,
        account: userAccount,
    };
    itemProfile["PartitionKey"] = "users";
    itemProfile["RowKey"] = profileName;

    console.log('about to put')
    console.log(itemProfile);
    return ddb.put({
        TableName: 'members',
        Item: itemProfile,
    }).promise();
  }

  async function getUserData(profileName) {
    let params = {
      TableName: 'members',
      Key: {
        "name": profileName
      }
    };

    // let userDataManual = {
    //   balanceBefore: 8500,
    //   pointsCompleted: 557,
    //   pointsOffset: 105,
    //   pointsEligible: 452,
    //   pointsPaid : 425,
    //   pointsCreditBefore: 1,
    //   pointsPaidToday: 25,
    //   pointsCreditAfter: 2,
    //   balanceAfter: 9000
    // };
    // recordUserData(username, userDataManual);

    // return userDataManual;


    let userData = await ddb.get(params, function(err, data) {
      if (err) {
          console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
          return null;
      } else {
          // console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
          console.log("Data returned");
          return data;
      }
    }).promise();

    return userData;
  }

  let dbResponse = getUserData(username);

  dbResponse.then(function(userData) {
    let account = userData.Item.account;

    console.log("Account before:");
    console.log(account);

    // Get the latest question count from FCC.
    const pointCount = 600;
    const ratePerPoint = 20;
    const pointsPayRequest = amountToPay / ratePerPoint;

    // Modify the data.

    // Is there a surplus in points to cover the amount requested?
    account.pointsCompleted = pointCount;
    account.pointsEligible = account.pointsCompleted - account.pointsOffset - account.pointsPaid;
    if (account.pointsEligible > pointsPayRequest) {
      console.log("Can pay: " + account.pointsEligible);
      console.log("Requested: " + pointsPayRequest);


      // Make payment
      account.pointsPaidToday = pointsPayRequest;
      account.balanceBefore = account.balanceAfter;
      account.pointsPaid = account.pointsPaid + account.pointsPaidToday;
      //account.pointsCreditBefore = account.pointsEligible
      account.pointsCreditAfter = account.pointsEligible - account.pointsPaidToday;
      account.balanceAfter = account.balanceBefore + amountToPay;

      console.log("Account afterwards:");
      console.log(account);
    } else {
      // Throw error: 'insufficient points';
    }

        // let userDataManual = {
    //   balanceBefore: 8500,
    //   pointsCompleted: 557,
    //   pointsOffset: 105,
    //   pointsEligible: 452,
    //   pointsPaid : 425,
    //   pointsCreditBefore: 1,
    //   pointsPaidToday: 25,
    //   pointsCreditAfter: 2,
    //   balanceAfter: 9000
    // };

    // Save the data.


    const htmlResponse = {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Credentials": "true"
      },
      body: JSON.stringify({
        message: 'Payment made',
        data: account
      }),
    };
    callback(null, htmlResponse);
  }, function(err) {
    console.log(err); // Error: "It broke"
    const errorResponse = {
      statusCode: 400,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Credentials": "true"
      },
      body: JSON.stringify({
        message: 'Error'
      }),
    };
    callback(null, errorResponse);
  });
  // userData.points_paid = userData.points_paid + 25;
  // console.log('jjj');
  // console.log(userData);
  //recordUserData(username, userData);



};
