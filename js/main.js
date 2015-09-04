require('ng-admin');
require('./api');

var myApp = angular.module('myApp', ['ng-admin']);

// custom API flavor
var apiFlavor = require('./api_flavor');
myApp.config(['RestangularProvider', apiFlavor.requestInterceptor]);
myApp.config(['RestangularProvider', apiFlavor.responseInterceptor]);

// custom 'amount' type
myApp.config(['NgAdminConfigurationProvider', function(nga) {
    nga.registerFieldType('amount', require('./types/AmountField'));
}]);
myApp.config(['FieldViewConfigurationProvider', function(fvp) {
    fvp.registerFieldView('amount', require('./types/AmountFieldView'));
}]);

// custom directives
myApp.directive('starRating', require('./directives/starRating'));
myApp.directive('basket', require('./directives/basket'));
myApp.directive('dashboardSummary', require('./directives/dashboardSummary'));

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

    require('./entities/customers')(nga, admin);
    require('./entities/categories')(nga, admin);
    require('./entities/products')(nga, admin);
    require('./entities/reviews')(nga, admin);
    require('./entities/commands')(nga, admin);

    var dashboard = require('./dashboard')(nga, admin);
    admin.dashboard(dashboard);

    var header = require('./header');
    admin.header(header);

    var menu = require('./menu')(nga, admin);
    admin.menu(menu);

    // attach the admin application to the DOM and execute it
    nga.configure(admin);
}]);


