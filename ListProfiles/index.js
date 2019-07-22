const azure = require('azure-storage');
const ServiceClient = {
  DEVSTORE_STORAGE_ACCESS_KEY: "INSERT-CONFIG",
  DEVSTORE_STORAGE_ACCOUNT: "INSERT-CONFIG",
}
const tableService = azure.createTableService(ServiceClient.DEVSTORE_STORAGE_ACCOUNT, ServiceClient.DEVSTORE_STORAGE_ACCESS_KEY);
const tableName = "profiles";

module.exports = function (context, req) {
  // Return the top 100 items
  var query = new azure.TableQuery().top(100);
  tableService.queryEntities(tableName, query, null, function (error, result, response) {
      if(!error){
        let profileList = response.body.value;
        let output = 'Profile results \n';

        output += profileList.map(function(key, index) {
          return key.name + ": " + key.points + " | " + key.last1 + " | " + key.last7;
        }).join('\n');

        context.res = {
          status: 200,
          body: output
        };
        context.done();
      } else {
          context.res.status(500).json({error : error});
      }
  });

};