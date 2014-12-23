var app = angular.module('myApp', []);

//create a factory 
app.factory('service', function ($q, $http) {
    var fixedEncodeURIComponent = function (str) {
        return encodeURIComponent(str).replace(/[!'()]/g, escape).replace(/\*/g, "%2A").replace(/\"/g, "%22");
    };
    var format = '&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=JSON_CALLBACK';

    return{

    	getHistoricalDataWithCallback: function(callback, symbol, startDate, endDate){
    		//query pramater
    		var query = 'select * from yahoo.finance.historicaldata where symbol = "' + symbol + '" and startDate = "' + startDate + '" and endDate = "' + endDate + '"';
    		//url pramater 
    		var url = 'http://query.yahooapis.com/v1/public/yql?q=' + fixedEncodeURIComponent(query) + format;
    		//log the url to the console
    		console.log(url);

			$http.jsonp(url).success(function(json){
				console.log(JSON.stringify(json));
				//accessing the data inside the JSON 
				var quotes = json.query.results.quote;
				callback(quotes); //I think this makes the function run again, but now with the quotes info??
			}).error(function (error) {
                console.log(JSON.stringify(error));
            
			});	
    	}
    };
});
//end of factory 

//start of controller
function Ctrl($scope, service){
	//sets default values
	$scope.symbol = 'C';
	$scope.items = [];
	$scope.startDate = '2013-01-01';
	$scope.endDate = '2014-01-01';
	$scope.options = [{
        value: 'callback'
    }/*, {
        value: '$q'
    }, {
        value: 'watch'
    }*/];
    $scope.method = $scope.options[0];

    //Registers a listener callback to be executed whenever the watchExpression changes.
    $scope.$watch(function combinedWatch() {
        return {
            symbol: $scope.symbol,
            startDate: $scope.startDate,
            endDate: $scope.endDate,
            method: $scope.method
        };
    }, function (value) {
        if (value.symbol && value.startDate && value.endDate && value.method) {
            console.log('Start updating ' + JSON.stringify(value));
            $scope.items = [];

            //callback method
            if ($scope.method.value === 'callback') {
                service.getHistoricalDataWithCallback(function (data) {
                    $scope.items = data;
                }, $scope.symbol, $scope.startDate, $scope.endDate);
            }
       
        }
    }, true);
}