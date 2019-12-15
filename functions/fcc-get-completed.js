'use strict';

const axios = require('axios');

module.exports.handler = async (event, context, callback) => {

  let profileName = '';
  let response = '';
  const responseHeader = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Credentials": "true"
  };

  if (event.queryStringParameters && event.queryStringParameters.user) {
      console.log("Fetching points for user: " + event.queryStringParameters.user);
      profileName = event.queryStringParameters.user;
  } else {
      response = {
          statusCode: 400,
          headers: responseHeader,
          body: JSON.stringify({
            message: "Please pass a profile name, e.g. ?user=some-username"
          })
      }
      return response;
  }

  // Fetch the user profile from FCC.
  const url = 'https://api.freecodecamp.org/api/users/get-public-profile?username=' + profileName;
  const ret = await axios.get(url);

  let profileData = ret.data;

  // Check for invalid profile profileData.
  if (!profileData.entities) {
    response = {
        statusCode: 400,
        headers: responseHeader,
        body: JSON.stringify({
          message: `No profile found for ${profileName}`
        })
    };
    callback(null, response);
    return;
  } else if (profileData.entities.user[profileName].isLocked) {
    response = {
        statusCode: 400,
        headers: responseHeader,
        body: JSON.stringify({
          message: `${profileName} is locked - this profile needs to be set to public to be visible here.`
        })
    };
    callback(null, response);
    return;
  }

  // Otherwise we're working with a valid profile.
  const points = profileData.entities.user[profileName].points;

  response = {
    statusCode: 200,
    headers: responseHeader,
    body: JSON.stringify({
      user: profileName,
      points: points,
      timestamp: new Date()
    }),
  };

  callback(null, response);

};
