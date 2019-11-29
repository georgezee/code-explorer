'use strict';
const AWS = require('aws-sdk');
const twilio = require('twilio');

module.exports.handler = (event, context, callback) => {
  var accountSid = process.env.twilio_sid;
  var authToken = process.env.twilio_auth_token;

  const sourcePhone = process.env.twilio_phone;
  const targetPhone = process.env.admin_phone;

  var twilio = require('twilio');
  var client = new twilio(accountSid, authToken);

  const username = event["queryStringParameters"]['user'] || 'unknown';
  const amountRequested = event["queryStringParameters"]['amount'] || 'unknown';

  client.messages.create({
      body: `Transfer requested for ${username} of ${amountRequested}.`,
      to: targetPhone,  // Text this number
      from: sourcePhone // From a valid Twilio number
  })
  .then((message) => console.log(message.sid));

  const response = {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Credentials": "true"
    },
    body: JSON.stringify({
      message: 'Message sent'
    }),
  };

  callback(null, response);

};
