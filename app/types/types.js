'use strict';

angular.module('myApp.types', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/types', {
    templateUrl: './types/types.html',
    controller: 'typesCtrl'
  });
}])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/types/:id', {
    templateUrl: './types/typesId.html',
    controller: 'typesIdCtrl'
  });
}])
.controller('typesCtrl', function($scope, api) {

    $scope.DynamicItems = {};

    api
    .universal('get','types')
    .then(function(results){
      $scope.DynamicItems = results;
      console.log(results);
    });



})

.controller('typesIdCtrl', function($scope, $routeParams, api, $http) {

    $scope.DynamicItem = {};
    $scope.MarketDataItem = {};

    console.log($routeParams);

    api
    .universal('get','types/'+$routeParams.id)
    .then(function(results){
      console.log(toPureHtml(results));

      $scope.DynamicItem = toPureHtml(results);
    });

    var table = {};
    table.data = [];
    table.labels = [];
    table.series = {};


    api
    .universal('get','market/10000002/types/'+$routeParams.id+'/history')
    .then(function(results){
        var j =0;

        for (var key in results.items[0] ){

            table.data.push(key);
            table.series[key] = [];
            for (var i=0; i<results.items.length; i++){
                table.series[key][i] = results.items[i][key];
            }
            j++;
        }


        // split the data set into ohlc and volume
        var highPrice = [],
            avgPrice = [],
            lowPrice = [],
            volume = [],
            order = [],
            dataLength = results.items.length,
        // set the allowed units for data grouping
            groupingUnits = [[
                'week',                         // unit name
                [1, 2]                             // allowed multiples
            ], [
                'month',
                [1]
            ]];

        i = 0;

        for (i; i < dataLength; i++) {

            highPrice.push([
                Date.parse(table.series['date'][i]),
                table.series['highPrice'][i]
            ]);

            avgPrice.push([
                Date.parse(table.series['date'][i]),
                table.series['avgPrice'][i]
            ]);

            lowPrice.push([
                Date.parse(table.series['date'][i]),
                table.series['lowPrice'][i]
            ]);

            volume.push([
                Date.parse(table.series['date'][i]), // the date
                table.series['volume'][i], // the volume
            ]);

            order.push([
                Date.parse(table.series['date'][i]), // the date
                table.series['orderCount'][i] // the volume
            ]);

        }




        // create the chart
        $('#chart').highcharts('StockChart', {

            rangeSelector: {
                selected: 1
            },

            title: {
                text: 'History price Jita of ' + $scope.DynamicItem.name
            },

            yAxis: [
                {
                labels: {
                    align: 'right',
                    x: -3
                },
                title: {
                    text: 'Price'
                },
                height: '60%',
                lineWidth: 2
            }, {
                labels: {
                    align: 'right',
                    x: -3
                },
                title: {
                    text: 'V\/O'
                },
                top: '65%',
                height: '35%',
                offset: 0,
                lineWidth: 2
            }],
            exporting: { enabled: false },
            series: [{
                name: 'lowPrice',
                data: lowPrice,
                dataGrouping: {
                    units: groupingUnits
                },
                tooltip: {
                    valueDecimals: 2
                }
            },{
                name: 'highPrice',
                data: highPrice,
                dataGrouping: {
                    units: groupingUnits
                },
                tooltip: {
                    valueDecimals: 2
                }
            },{
                name: 'avgPrice',
                data: avgPrice,
                dataGrouping: {
                    units: groupingUnits
                },
                tooltip: {
                    valueDecimals: 2
                }
            },{
                type: 'column',
                name: 'Order',
                data: order,
                yAxis: 1,
                dataGrouping: {
                    units: groupingUnits
                }
            },{
                type: 'column',
                name: 'Volume',
                data: volume,
                yAxis: 1,
                dataGrouping: {
                    units: groupingUnits
                }
            }]
        });


    });

    $scope.onClick = function (points, evt) {
        console.log(points, evt);
    };


});

function toPureHtml(data){
  return JSON.parse(
      JSON.stringify(data)
      .replace(new RegExp('0xFF', 'g'), '#')
      .replace(new RegExp('showinfo:', 'g'), '#/types/')
  );
}