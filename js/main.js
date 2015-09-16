// require('ng-admin'); removed here and added back as a <script> tag to hep debugging - WebPack doesn't properly handle sourcemaps of dependencies yet
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
myApp.directive('approveReview', require('./reviews/approveReview'));
myApp.directive('batchApprove', require('./reviews/batchApprove'));
myApp.directive('starRating', require('./reviews/starRating'));
myApp.directive('basket', require('./commands/basket'));
myApp.directive('dashboardSummary', require('./dashboard/dashboardSummary'));

// custom controllers
myApp.controller('username', ['$scope', '$window', function($scope, $window) { // used in header.html
    $scope.username =  $window.localStorage.getItem('posters_galore_login');
}])

// custom states (pages)
myApp.config(['$stateProvider', require('./segments/segmentsState')]);

myApp.config(['NgAdminConfigurationProvider', '$windowProvider', function (nga, $window) {
    // create the admin application
    var admin = nga.application('My First Admin')
        .baseApiUrl('/');

    if ($window.$get().localStorage.getItem('posters_galore_login') == 'admin') { //retrieving current role
        // add entities
        admin.addEntity(nga.entity('customers'));
        admin.addEntity(nga.entity('categories'));
        admin.addEntity(nga.entity('products'));
        admin.addEntity(nga.entity('reviews'));
        admin.addEntity(nga.entity('commands'));

        // configure entities
        require('./customers/config')(nga, admin);
        require('./categories/config')(nga, admin);
        require('./products/config')(nga, admin);
        require('./reviews/config')(nga, admin);
        require('./commands/config')(nga, admin);

        admin.dashboard(require('./dashboard/config')(nga, admin));
        admin.header(require('./header.html'));
        admin.menu(require('./menu')(nga, admin));

        // attach the admin application to the DOM and execute it
        nga.configure(admin);
    } else {
        // add entities
        admin.addEntity(nga.entity('customers').readOnly());
        admin.addEntity(nga.entity('categories').readOnly());
        admin.addEntity(nga.entity('products').readOnly());

        // configure entities
        require('./customers/userConfig')(nga, admin);
        require('./categories/userConfig')(nga, admin);
        require('./products/userConfig')(nga, admin);

        admin.dashboard(require('./dashboard/userConfig')(nga, admin, $window.$get()));
        admin.header(require('./header.html'));
        admin.menu(require('./userMenu')(nga, admin));

        // attach the admin application to the DOM and execute it
        nga.configure(admin);
    }

}]);
