import moment from 'moment';
import dashboardSummaryTemplate from './dashboardSummary.html';

var oneMonthAgo = moment().subtract(1, 'months').toDate();

function dashboardSummary(Restangular) {
    'use strict';

    return {
        restrict: 'E',
        scope: {},
        controller: function($scope) {
            $scope.stats = {};
            Restangular
                .all('commands')
                .getList({range: '[1,100]', sort: '["date","DESC"]'})
                .then(commands => {
                    $scope.stats.commands = commands.data
                        .filter(command => new Date(command.date) > oneMonthAgo)
                        .reduce((stats, command) => {
                            if (command.status != 'cancelled') stats.revenue += command.total;
                            if (command.status == 'ordered') stats.pending_orders++;
                            return stats;
                        }, { revenue: 0, pending_orders: 0})
                });
            Restangular
                .all('customers')
                .getList({range: '[1,100]', sort: '["first_seen","DESC"]', filter: '{"has_ordered":true}'})
                .then(customers => {
                    $scope.stats.customers = customers.data
                        .filter(customer => new Date(customer.first_seen) > oneMonthAgo)
                        .reduce(nb => ++nb, 0)
                });
            Restangular
                .all('reviews')
                .getList({range: '[1,100]', sort: '["date","DESC"]'})
                .then(reviews => {
                    $scope.stats.reviews = reviews.data
                        .filter(review => new Date(review.date) > oneMonthAgo)
                        .reduce(nb => ++nb, 0)
                });
        },
        template: dashboardSummaryTemplate
    };
}

dashboardSummary.$inject = ['Restangular'];

export default dashboardSummary;
