module.exports = function (context, req) {
  context.log('Code Explorer starts here.');

  const got = require('got');

  if (profileName = req.query.profile) {

    got('https://www.freecodecamp.org/api/users/get-public-profile?username=' + profileName, { json: true }).then(response => {
      // Check for invalid profile response.
      if (!response.body.entities) {
        context.res = {
          status: 400,
          body: `No profile found for ${profileName}`
        };
        context.done();
      } else if (response.body.entities.user[profileName].isLocked) {
        context.res = {
          status: 400,
          body: `${profileName} is locked - this profile needs to be set to public to be visible here.`
        };
        context.done();
      }

      // Otherwise we're working with a valid profile.
      const points = response.body.entities.user[profileName].points;
      const challenges = response.body.entities.user[profileName].completedChallenges;

      let isValid = true;
      if (response.body.entities.user[profileName].isCheater
          || !response.body.entities.user[profileName].isHonest) {
        isValid = false;
      }

      // Construct the user object containing the date we'd like to persist.
      let userSave =
        {
          'username': profileName,
          'points' : points,
          'challenges' : challenges,
          'valid' : isValid
        }

      let output = `FreeCodeCamp profile for ${profileName} \n`;
      output += `points: ${userSave.points} \n`;

      // TODO: persist to DB.

      context.res = {
        status: 200,
        body: output
      };
      context.done();

    }).catch(error => {
      console.log(error.response.body);
    });
  }
  else {
    context.res = {
      status: 400,
      body: "Please pass a profile name, e.g. GetProfile?profile=some-username"
    };
    context.done();
  }


};