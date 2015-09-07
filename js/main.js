require('ng-admin');
require('./api');

var myApp = angular.module('myApp', ['ng-admin']);

// custom API flavor
var apiFlavor = require('./api_flavor');
myApp.config(['RestangularProvider', apiFlavor.requestInterceptor]);
myApp.config(['RestangularProvider', apiFlavor.responseInterceptor]);

// custom 'amount' type
myApp.config(['NgAdminConfigurationProvider', 'FieldViewConfigurationProvider', function(nga, fvp) {
    nga.registerFieldType('amount', require('./types/AmountField'));
    fvp.registerFieldView('amount', require('./types/AmountFieldView'));
}]);

// custom directives
myApp.directive('approveReview', require('./directives/approveReview'));
myApp.directive('starRating', require('./directives/starRating'));
myApp.directive('basket', require('./directives/basket'));
myApp.directive('dashboardSummary', require('./directives/dashboardSummary'));

// custom controllers
myApp.controller('username', ['$scope', '$window', function($scope, $window) { // used in header.html
    $scope.username =  $window.localStorage.getItem('posters_galore_login');
}])

// custom states (pages)
myApp.config(['$stateProvider', require('./states/segments')]);

myApp.config(['NgAdminConfigurationProvider', function (nga) {
    // create the admin application
    var admin = nga.application('My First Admin')
        .baseApiUrl('/');

    // add entities
    admin.addEntity(nga.entity('customers'));
    admin.addEntity(nga.entity('categories'));
    admin.addEntity(nga.entity('products'));
    admin.addEntity(nga.entity('reviews'));
    admin.addEntity(nga.entity('commands'));

    // configure entities
    require('./entities/customers')(nga, admin);
    require('./entities/categories')(nga, admin);
    require('./entities/products')(nga, admin);
    require('./entities/reviews')(nga, admin);
    require('./entities/commands')(nga, admin);

    admin.dashboard(require('./dashboard')(nga, admin));
    admin.header(require('./header.html'));
    admin.menu(require('./menu')(nga, admin));

    // attach the admin application to the DOM and execute it
    nga.configure(admin);
}]);
