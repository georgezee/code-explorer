const got = require('got');

const azure = require('azure-storage');
const ServiceClient = {
  DEVSTORE_STORAGE_ACCESS_KEY: "SECRET",
  DEVSTORE_STORAGE_ACCOUNT: "SECRET",
}
const tableService = azure.createTableService(ServiceClient.DEVSTORE_STORAGE_ACCOUNT, ServiceClient.DEVSTORE_STORAGE_ACCESS_KEY);
const tableName = "profiles";

module.exports = function (context, req) {
  context.log('Code Explorer starts here.');

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

      let output = `FreeCodeCamp.org profile for ${profileName} \n`;
      output += `points: ${userSave.points} \n`;
      // Include a list of the users scores across the intervals.
      output += "pointsTable: \n" + Object.keys(userSave.pointsTable).map(function(key, index) {
        if (key == 1) {
          return `  in last 24 hours: ${userSave.pointsTable[key]} \n`
        } else {
          return `  in last ${key} days: ${userSave.pointsTable[key]} \n`
        }
      }).join('');

      // Persist to DB.
      let itemProfile = {
        name: profileName,
        profile: JSON.stringify(userSave),
        points: userSave.points,
        valid: userSave.isValid,
        last1: userSave.pointsTable[1],
        last7: userSave.pointsTable[7],
        last30: userSave.pointsTable[30],
        last90: userSave.pointsTable[90],
        last180: userSave.pointsTable[180],
        last365: userSave.pointsTable[365],
      };
      itemProfile["PartitionKey"] = "profiles";
      itemProfile["RowKey"] = profileName;

      tableService.insertOrMergeEntity(tableName, itemProfile, { echoContent: true }, function (error, result, response) {
        if (!error) {
          // This returns a 201 code + the database response inside the body
          // Calling status like this will automatically trigger a context.done()
          //context.res.status(201).json(response);
          context.log('DB write success');
          context.res = {
            status: 200,
            body: output
          };
          context.done();
        } else {
          // In case of an error we return an appropriate status code and the error returned by the DB
          context.log('DB write fail');
          context.res.status(500).json({ error: error });
        }
      });

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