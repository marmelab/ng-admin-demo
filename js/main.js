require('ng-admin');
require('ng-admin/build/ng-admin.min.css');
require('./api');

var username = window.localStorage.getItem('posters_galore_login');
if (!username) {
    window.location.href = "./login.html";
}

var myApp = angular.module('myApp', ['ng-admin']);

myApp.value('username', username);

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

myApp.config(['NgAdminConfigurationProvider', function (nga) {
    // create the admin application
    var admin = nga.application('My First Admin')
        .baseApiUrl('/');

    // add entities
    var customers = require('./entities/customers')(nga);
    admin.addEntity(customers);

    var categories = require('./entities/categories')(nga);
    admin.addEntity(categories);

    var products = require('./entities/products')(nga);
    admin.addEntity(products);

    var reviews = require('./entities/reviews')(nga);
    admin.addEntity(reviews);

    var commands = require('./entities/commands')(nga);
    admin.addEntity(commands);

    var dashboard = require('./dashboard')(nga, commands, reviews, customers);
    admin.dashboard(dashboard);

    var header = require('./header');
    admin.header(header);

    var menu = require('./menu')(nga, customers, categories, products, reviews, commands);
    admin.menu(menu);

    // attach the admin application to the DOM and execute it
    nga.configure(admin);
}]);


