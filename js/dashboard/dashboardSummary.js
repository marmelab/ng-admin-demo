import moment from 'moment';
import dashboardSummaryTemplate from './dashboardSummary.html';

var oneMonthAgo = moment().subtract(1, 'months').toDate();

var has_seen_alert = false;

function dashboardSummary(Restangular) {
    'use strict';

    return {
        restrict: 'E',
        scope: {},
        controller: function($scope) {
            $scope.stats = {};
            $scope.has_seen_alert = has_seen_alert;
            $scope.dismissAlert = () => {
                has_seen_alert = true;
                $scope.has_seen_alert = true;
            };
            Restangular
                .all('commands')
                .getList({filter: '{"date_gte":"' + oneMonthAgo.toISOString() +'"}', sort: '["date","DESC"]'})
                .then(commands => {
                    $scope.stats.commands = commands.data
                        .reduce((stats, command) => {
                            if (command.status != 'cancelled') stats.revenue += command.total;
                            if (command.status == 'ordered') stats.pending_orders++;
                            return stats;
                        }, { revenue: 0, pending_orders: 0})
                });
            Restangular
                .all('customers')
                .getList({range: '[1,100]', sort: '["first_seen","DESC"]', filter: '{"has_ordered":true,"first_seen_gte":"' +oneMonthAgo.toISOString() + '"}'})
                .then(customers => {
                    $scope.stats.customers = customers.data.reduce(nb => ++nb, 0)
                });
            Restangular
                .all('reviews')
                .getList({range: '[1,100]', sort: '["date","DESC"]', filter: '{"status":"pending"}'})
                .then(reviews => {
                    $scope.stats.reviews = reviews.data.reduce(nb => ++nb, 0)
                });
        },
        template: dashboardSummaryTemplate
    };
}

dashboardSummary.$inject = ['Restangular'];

export default dashboardSummary;
