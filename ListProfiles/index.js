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
  var template = `
  <html>
    <head>
      <script src='https://cdn.jsdelivr.net/npm/chart.js@2.8.0/dist/Chart.min.js'></script>
    </head>

    <body>
        <canvas id='myChart' width='600' height='800'></canvas>
        <script>
        var ctx = document.getElementById('myChart');
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: [DATA-GOES-HERE],
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
        </script>
    </body>

  </html>
  `;

  tableService.queryEntities(tableName, query, null, function (error, result, response) {
    if(!error){
      let profileList = response.body.value;
      let output = 'Profile results \n';

      let nameList = profileList.map(function(key, index) {
        return key.name;
      });

      let scoreList = profileList.map(function(key, index) {
        return key.points;
      });

      let tableData = {
        labels: nameList,
        datasets: [{
            label: 'Total points',
            data: scoreList,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
      };

      output += profileList.map(function(key, index) {
        return key.name + ": " + key.points + " | " + key.last1 + " | " + key.last7;
      }).join('\n');

      output = template.replace("[DATA-GOES-HERE]", JSON.stringify(tableData));
      context.res = {
        status: 200,
        headers: { "Content-Type":" text/html; charset=utf-8" },
        body: output
      };
      context.done();
    } else {
        context.res.status(500).json({error : error});
    }
  });

};