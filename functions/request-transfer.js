'use strict';
const AWS = require('aws-sdk');
const twilio = require('twilio');

module.exports.handler = (event, context, callback) => {
  var accountSid = process.env.twilio_sid;
  var authToken = process.env.twilio_auth_token;

  const sourcePhone = process.env.twilio_phone;
  const targetPhone = 'INSERT-PHONE-HERE';

  var twilio = require('twilio');
  var client = new twilio(accountSid, authToken);

  client.messages.create({
      body: 'Transfer requested for Miriam.',
      to: targetPhone,  // Text this number
      from: sourcePhone // From a valid Twilio number
  })
  .then((message) => console.log(message.sid));

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }),
  };

  callback(null, response);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};
