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

  // The list of projects completed are those with challengeType set to 3.
  let projects = 0;
  const challenges = profileData.entities.user[profileName].completedChallenges;
  projects = challenges.reduce((total, challenge) => {
    if (challenge.challengeType && challenge.challengeType == 3) {
      total ++;
    }
    return total;
  }, 0);

  let isValid = true;
  if (profileData.entities.user[profileName].isCheater
      || !profileData.entities.user[profileName].isHonest) {
    isValid = false;
  }



  response = {
    statusCode: 200,
    headers: responseHeader,
    body: JSON.stringify({
      user: profileName,
      points: points,
      projects: projects,
      valid: isValid,
      timestamp: new Date()
    }),
  };

  callback(null, response);

};
