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

      // The list of intervals we're interested in recording.
      let intervals = [1,7,30,90,180,365];

      const pointsTable = intervals.reduce((tally, days) => {
        tally[days] = challenges.reduce((total, challenge) => {
          // Calculate the date X days ago for comparison.
          let date = new Date();
          let daysAgo = date.setDate(date.getDate() - days);

          if (challenge.completedDate > daysAgo) {
            total ++;
          }
          return total;
        }, 0);
        return tally;
      } , {})

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
          'pointsTable' : pointsTable,
          'challenges' : challenges,
          'valid' : isValid
        }

      let output = `FreeCodeCamp profile for ${profileName} \n`;
      output += `points: ${userSave.points} \n`;
      // Include a list of the users scores across the intervals.
      output += "pointsTable: \n" + Object.keys(userSave.pointsTable).map(function(key, index) {
        if (key == 1) {
          return `  in last 24 hours: ${userSave.pointsTable[key]} \n`
        } else {
          return `  in last ${key} days: ${userSave.pointsTable[key]} \n`
        }
      }).join('');

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